import type { VercelRequest, VercelResponse } from '@vercel/node';

type Body = { cityRef?: string };

type NpWarehouse = {
  Ref: string;
  Description: string;
};

function pickString(value: unknown, maxLen = 120): string {
  const s = String(value ?? '').trim();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.NOVA_POSHTA_API_KEY;
  if (!apiKey) {
    res.status(501).json({ error: 'NOVA_POSHTA_API_KEY is not set' });
    return;
  }

  const { cityRef } = (req.body || {}) as Body;
  const ref = pickString(cityRef, 64);
  if (!ref) {
    res.status(400).json({ error: 'cityRef is required' });
    return;
  }

  const payload = {
    apiKey,
    modelName: 'AddressGeneral',
    calledMethod: 'getWarehouses',
    methodProperties: {
      CityRef: ref,
      Limit: '50',
      Language: 'UA',
    },
  };

  try {
    const resp = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      res.status(502).json({ error: 'Nova Poshta upstream error' });
      return;
    }

    const data = (await resp.json()) as {
      success?: boolean;
      data?: NpWarehouse[];
      errors?: string[];
    };

    if (!data?.success) {
      res.status(200).json({ ok: true, warehouses: [], errors: data?.errors ?? [] });
      return;
    }

    const warehouses = Array.isArray(data.data)
      ? data.data.map((w) => ({ ref: pickString(w.Ref, 64), name: pickString(w.Description, 160) }))
      : [];

    res.status(200).json({ ok: true, warehouses });
  } catch {
    res.status(502).json({ error: 'Nova Poshta request failed' });
  }
}
