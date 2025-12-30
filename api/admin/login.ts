import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdminEnvCreds, makeAdminSessionCookie } from '../_adminSession';

type Body = { username?: string; password?: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { username, password } = (req.body || {}) as Body;
  const creds = getAdminEnvCreds();

  if (String(username || '') !== creds.username || String(password || '') !== creds.password) {
    res.status(401).json({ ok: false, error: 'Invalid credentials' });
    return;
  }

  res.setHeader('Set-Cookie', makeAdminSessionCookie());
  res.status(200).json({ ok: true });
}
