export const ADMIN_STORAGE_KEY = 'kalaur_admin_ok';

// IMPORTANT SECURITY NOTE:
// This project is a Vite SPA. Any credentials shipped to the browser are NOT secure.
// This is only meant to prevent accidental access.
// For real admin security, protect routes server-side (or use Shopify admin, etc.).
export const ADMIN_USERNAME = 'admi';
export const ADMIN_PASSWORD = 'admin';

export function isAdminAuthed(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ADMIN_STORAGE_KEY) === '1';
}

export function setAdminAuthed(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_STORAGE_KEY, '1');
}

export function clearAdminAuthed(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}
