import type { VercelRequest, VercelResponse } from '@vercel/node';

type Body = { query?: string };

type NpCity = {
  Ref: string;
  Description: string;
  SettlementTypeDescription?: string;
  AreaDescription?: string;
  RegionDescription?: string;
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

  const { query } = (req.body || {}) as Body;
  const q = pickString(query, 60);
  if (!q) {
    res.status(200).json({ ok: true, cities: [] as Array<{ ref: string; name: string }> });
    return;
  }

  const payload = {
    apiKey,
    modelName: 'AddressGeneral',
    calledMethod: 'getCities',
    methodProperties: {
      FindByString: q,
      Limit: '20',
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
      data?: NpCity[];
      errors?: string[];
    };

    if (!data?.success) {
      res.status(200).json({ ok: true, cities: [], errors: data?.errors ?? [] });
      return;
    }

    const cities = Array.isArray(data.data)
      ? data.data.map((c) => {
          const parts = [
            pickString(c.Description),
            pickString(c.RegionDescription),
            pickString(c.AreaDescription),
          ].filter(Boolean);
          return { ref: pickString(c.Ref, 64), name: parts.join(', ') };
        })
      : [];

    res.status(200).json({ ok: true, cities });
  } catch {
    res.status(502).json({ error: 'Nova Poshta request failed' });
  }
}
