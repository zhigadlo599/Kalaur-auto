import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearAdminSessionCookie } from '../_adminSession';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.setHeader('Set-Cookie', clearAdminSessionCookie());
  res.status(200).json({ ok: true });
}
