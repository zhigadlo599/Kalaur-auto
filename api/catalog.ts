import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { shopProducts } from '../src/data/shopProducts';
import type { PartCondition, ShopProduct } from '../src/types/shop';
import type { CatalogOverride } from '../src/lib/catalogStorage';
import { isAdminSessionValid } from './_adminSession';

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
    const id = String(row.id || '');
    if (!allowedIds.has(id)) continue;

    const override: CatalogOverride = { id };
    if (typeof row.name === 'string' && row.name.trim().length > 0) override.name = row.name;
    if (typeof row.inStock === 'boolean') override.inStock = row.inStock;
    if (isCondition(row.condition)) override.condition = row.condition;
    if (typeof (row as any).sku === 'string' && String((row as any).sku).trim().length > 0) override.sku = String((row as any).sku).trim();
    if (typeof (row as any).description === 'string' && String((row as any).description).trim().length > 0) override.description = String((row as any).description);
    if (typeof (row as any).imageUrl === 'string' && String((row as any).imageUrl).trim().length > 0) override.imageUrl = String((row as any).imageUrl).trim();
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
      sku: typeof o.sku === 'string' ? o.sku : p.sku,
      description: typeof o.description === 'string' ? o.description : p.description,
      imageUrl: typeof o.imageUrl === 'string' ? o.imageUrl : p.imageUrl,
      stockQty: typeof o.stockQty === 'number' ? o.stockQty : p.stockQty,
      priceUah: p.priceUah,
    };
  });
}

async function readOverridesFromKv(): Promise<CatalogOverride[]> {
  try {
    const raw = await kv.get(KV_KEY);
    return sanitizeOverrides(raw);
  } catch {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const overrides = await readOverridesFromKv();
    const catalog = mergeCatalog(shopProducts, overrides);
    res.status(200).json({ catalog, overrides });
    return;
  }

  if (req.method === 'PUT') {
    const ok = isAdminSessionValid(req.headers.cookie as string | undefined);
    if (!ok) {
      res.status(401).json({ error: 'Not authorized' });
      return;
    }

    const body = req.body as unknown;
    const overrides = sanitizeOverrides((body as any)?.overrides);

    try {
      await kv.set(KV_KEY, overrides);
      const catalog = mergeCatalog(shopProducts, overrides);
      res.status(200).json({ ok: true, catalog, overrides });
    } catch {
      res.status(500).json({ error: 'Failed to write catalog' });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
