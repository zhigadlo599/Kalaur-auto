import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

type Body = {
  items?: Array<{ productId: string; quantity: number }>;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const catalog: Record<string, { name: string; unitAmountUah: number; inStock: boolean }> = {
  // NOTE: prices are placeholders; set real prices before enabling stock.
  'new-oil-filter': { name: 'Фільтр масляний (новий)', unitAmountUah: 0, inStock: false },
  'new-air-filter': { name: 'Фільтр повітряний (новий)', unitAmountUah: 0, inStock: false },
  'new-brake-pads': { name: 'Гальмівні колодки (нові)', unitAmountUah: 0, inStock: false },
  'new-alternator': { name: 'Генератор (новий)', unitAmountUah: 0, inStock: false },
  'new-clutch-kit': { name: 'Комплект зчеплення (новий)', unitAmountUah: 0, inStock: false },

  'used-starter': { name: 'Стартер (б/у)', unitAmountUah: 0, inStock: false },
  'used-turbo': { name: 'Турбіна (б/у)', unitAmountUah: 0, inStock: false },
  'used-gearbox': { name: 'Коробка передач (б/у)', unitAmountUah: 0, inStock: false },
  'used-ecu': { name: 'Блок керування ECU (б/у)', unitAmountUah: 0, inStock: false },
  'used-headlight': { name: 'Фара (б/у)', unitAmountUah: 0, inStock: false },
};

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

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    const productId = String(item.productId || '');
    const quantity = Math.max(1, Math.floor(Number(item.quantity || 1)));
    const product = catalog[productId];

    if (!product) continue;
    if (!product.inStock) continue;
    if (product.unitAmountUah <= 0) continue;

    line_items.push({
      quantity,
      price_data: {
        currency: 'uah',
        product_data: { name: product.name },
        unit_amount: product.unitAmountUah,
      },
    });
  }

  if (line_items.length === 0) {
    res.status(400).json({ error: 'Cart is empty or items are not available' });
    return;
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

  const origin = (req.headers.origin as string) || 'http://localhost:5173';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    success_url: `${origin}/shop?success=1`,
    cancel_url: `${origin}/cart`,
  });

  res.status(200).json({ url: session.url });
}
