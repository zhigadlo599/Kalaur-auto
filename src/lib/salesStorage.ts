export type SaleKind = 'product' | 'service';

export type SaleRecord = {
  id: string;
  kind: SaleKind;
  refId: string; // productId or serviceId
  quantity: number;
  amountUah: number;
  createdAt: number; // epoch ms
};

const STORAGE_KEY = 'kalaur_sales_v1';

function safeParseInt(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeSales(input: unknown): SaleRecord[] {
  if (!Array.isArray(input)) return [];
  const cleaned: SaleRecord[] = [];

  for (const row of input) {
    if (!isRecord(row)) continue;
    const kind = row.kind === 'product' || row.kind === 'service' ? row.kind : null;
    if (!kind) continue;

    const refId = String(row.refId || '').trim();
    if (!refId) continue;

    const quantity = safeParseInt(row.quantity);
    if (quantity === null || quantity <= 0) continue;

    const amountUah = Number(row.amountUah);
    if (!Number.isFinite(amountUah) || amountUah < 0) continue;

    const createdAt = Number(row.createdAt);
    if (!Number.isFinite(createdAt) || createdAt <= 0) continue;

    const id = String(row.id || '').trim();
    if (!id) continue;

    cleaned.push({ id, kind, refId, quantity, amountUah, createdAt });
  }

  return cleaned;
}

export function readSales(): SaleRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sanitizeSales(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

export function writeSales(sales: SaleRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

export function appendSales(next: SaleRecord[]): void {
  if (next.length === 0) return;
  const prev = readSales();
  writeSales([...prev, ...next]);
}

export function makeSaleId(): string {
  // good enough for client-side unique IDs
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function startOfDayLocal(epochMs: number): number {
  const d = new Date(epochMs);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export type SalesWindow = 'day' | 'week' | 'year';

export function windowStart(now: number, window: SalesWindow): number {
  if (window === 'day') return startOfDayLocal(now);
  if (window === 'week') return now - 7 * 24 * 60 * 60 * 1000;
  return now - 365 * 24 * 60 * 60 * 1000;
}

export function sumSoldQuantity(params: {
  sales: SaleRecord[];
  kind: SaleKind;
  refId: string;
  window: SalesWindow;
  now?: number;
}): number {
  const now = params.now ?? Date.now();
  const from = windowStart(now, params.window);

  let total = 0;
  for (const s of params.sales) {
    if (s.kind !== params.kind) continue;
    if (s.refId !== params.refId) continue;
    if (s.createdAt < from || s.createdAt > now) continue;
    total += s.quantity;
  }
  return total;
}

export function sumSoldAmount(params: {
  sales: SaleRecord[];
  kind: SaleKind;
  refId: string;
  window: SalesWindow;
  now?: number;
}): number {
  const now = params.now ?? Date.now();
  const from = windowStart(now, params.window);

  let total = 0;
  for (const s of params.sales) {
    if (s.kind !== params.kind) continue;
    if (s.refId !== params.refId) continue;
    if (s.createdAt < from || s.createdAt > now) continue;
    total += s.amountUah;
  }
  return total;
}
