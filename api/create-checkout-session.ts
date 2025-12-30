import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { kv } from '@vercel/kv';
import { shopProducts } from '../src/data/shopProducts';
import type { CatalogOverride } from '../src/lib/catalogStorage';
import type { PartCondition, ShopProduct } from '../src/types/shop';

type Body = {
  items?: Array<{ productId: string; quantity: number }>;
  shipping?: {
    provider?: 'novaposhta';
    recipientName?: string;
    recipientPhone?: string;
    cityRef?: string;
    cityName?: string;
    warehouseRef?: string;
    warehouseName?: string;
    shippingCostUah?: number;
  };
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const KV_KEY = 'kalaur_catalog_overrides_v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCondition(value: unknown): value is PartCondition {
  return value === 'new' || value === 'used';
}

function safeNonNegativeInt(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i < 0) return null;
  return i;
}

function sanitizeOverrides(input: unknown): CatalogOverride[] {
  if (!Array.isArray(input)) return [];
  const allowedIds = new Set(shopProducts.map((p) => p.id));

  const cleaned: CatalogOverride[] = [];
  for (const row of input) {
    if (!isRecord(row)) continue;
    const id = String((row as any).id || '');
    if (!allowedIds.has(id)) continue;

    const override: CatalogOverride = { id };
    if (typeof (row as any).name === 'string' && String((row as any).name).trim().length > 0) override.name = String((row as any).name);
    if (typeof (row as any).inStock === 'boolean') override.inStock = (row as any).inStock;
    if (isCondition((row as any).condition)) override.condition = (row as any).condition;
    const stockQty = safeNonNegativeInt((row as any).stockQty);
    if (stockQty !== null) override.stockQty = stockQty;

    cleaned.push(override);
  }

  return cleaned;
}

function mergeCatalog(base: ShopProduct[], overrides: CatalogOverride[]): ShopProduct[] {
  const map = new Map(overrides.map((o) => [o.id, o] as const));
  return base.map((p) => {
    const o = map.get(p.id);
    if (!o) return p;
    return {
      ...p,
      name: typeof o.name === 'string' ? o.name : p.name,
      inStock: typeof o.inStock === 'boolean' ? o.inStock : p.inStock,
      condition: o.condition ?? p.condition,
      stockQty: typeof o.stockQty === 'number' ? o.stockQty : p.stockQty,
      priceUah: p.priceUah,
    };
  });
}

async function getCatalog(): Promise<Map<string, ShopProduct>> {
  try {
    const raw = await kv.get(KV_KEY);
    const overrides = sanitizeOverrides(raw);
    const merged = mergeCatalog(shopProducts as ShopProduct[], overrides);
    return new Map(merged.map((p) => [p.id, p] as const));
  } catch {
    return new Map((shopProducts as ShopProduct[]).map((p) => [p.id, p] as const));
  }
}

function getRequestOrigin(req: VercelRequest): string {
  const headerOrigin = req.headers.origin as string | undefined;
  if (headerOrigin) return headerOrigin;

  const referer = req.headers.referer as string | undefined;
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // fallthrough
    }
  }

  return 'http://localhost:5173';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  if (!stripeSecretKey) {
    res.status(500).json({ error: 'STRIPE_SECRET_KEY is not set' });
    return;
  }

  const body = req.body as Body;
  const items = Array.isArray(body?.items) ? body.items : [];
  const shipping = body?.shipping;

  const productById = await getCatalog();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const productId = String(item.productId || '');
    const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)));
    const product = productById.get(productId);

    if (!product) {
      res.status(400).json({ error: `Unknown productId: ${productId}` });
      return;
    }
    if (!product.inStock) {
      res.status(400).json({ error: `Product not in stock: ${productId}` });
      return;
    }
    if (typeof product.stockQty === 'number' && product.stockQty < quantity) {
      res.status(400).json({ error: `Not enough stock: ${productId}` });
      return;
    }
    if (!product.priceUah || product.priceUah <= 0) {
      res.status(400).json({ error: `Invalid product price: ${productId}` });
      return;
    }

    line_items.push({
      quantity,
      price_data: {
        currency: 'uah',
        product_data: { name: product.name },
        unit_amount: product.priceUah,
      },
    });
  }

  if (line_items.length === 0) {
    res.status(400).json({ error: 'Cart is empty or items are not available' });
    return;
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

  const origin = getRequestOrigin(req);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    metadata: shipping?.provider
      ? {
          shipping_provider: String(shipping.provider),
          shipping_recipient_name: String(shipping.recipientName || '').slice(0, 120),
          shipping_recipient_phone: String(shipping.recipientPhone || '').slice(0, 60),
          shipping_city_ref: String(shipping.cityRef || '').slice(0, 64),
          shipping_city_name: String(shipping.cityName || '').slice(0, 200),
          shipping_warehouse_ref: String(shipping.warehouseRef || '').slice(0, 64),
          shipping_warehouse_name: String(shipping.warehouseName || '').slice(0, 200),
          shipping_cost_uah: String(Number.isFinite(shipping.shippingCostUah) ? shipping.shippingCostUah : 0).slice(0, 32),
        }
      : undefined,
    success_url: `${origin}/cart?success=1`,
    cancel_url: `${origin}/cart?canceled=1`,
  });

  res.status(200).json({ url: session.url });
}
