import crypto from 'node:crypto';

const cookieName = 'kalaur_admin_session';

function base64url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/=+$/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  return Buffer.from(b64 + pad, 'base64').toString('utf8');
}

function sign(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

function timingSafeEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

export function getAdminEnvCreds() {
  return {
    username: process.env.ADMIN_USERNAME || 'admi',
    password: process.env.ADMIN_PASSWORD || 'admin',
  };
}

export function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'dev-only-secret-change-me';
}

export function makeAdminSessionCookie(): string {
  const payload = { exp: Date.now() + 1000 * 60 * 60 * 24 * 7 };
  const data = base64url(JSON.stringify(payload));
  const sig = sign(data, getSessionSecret());
  const value = `${data}.${sig}`;

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`;
}

export function clearAdminSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function isAdminSessionValid(cookieHeader: string | undefined): boolean {
  if (!cookieHeader) return false;
  const parts = cookieHeader.split(';').map((p) => p.trim());
  const match = parts.find((p) => p.startsWith(`${cookieName}=`));
  if (!match) return false;
  const value = match.slice(`${cookieName}=`.length);

  const [data, sig] = value.split('.');
  if (!data || !sig) return false;

  const expected = sign(data, getSessionSecret());
  if (!timingSafeEqual(sig, expected)) return false;

  try {
    const payload = JSON.parse(base64urlDecode(data)) as { exp?: number };
    if (!payload?.exp) return false;
    return Date.now() < payload.exp;
  } catch {
    return false;
  }
}
