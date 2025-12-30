export type ServiceOrder = {
  id: string;
  serviceId: string;
  serviceTitle: string;
  amountUah: number;
  ownerName: string;
  ownerPhone?: string;
  carMake?: string;
  carModel?: string;
  carYear?: number;
  vin?: string;
  plate?: string;
  notes?: string;
  createdAt: number;
};

const STORAGE_KEY = 'kalaur_service_orders_v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function safeTrim(value: unknown): string {
  return String(value ?? '').trim();
}

function safeYear(value: unknown): number | undefined {
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  const y = Math.trunc(n);
  if (y < 1900 || y > 2100) return undefined;
  return y;
}

function sanitizeOrders(input: unknown): ServiceOrder[] {
  if (!Array.isArray(input)) return [];
  const cleaned: ServiceOrder[] = [];

  for (const row of input) {
    if (!isRecord(row)) continue;
    const id = safeTrim(row.id);
    const serviceId = safeTrim((row as any).serviceId);
    const serviceTitle = safeTrim((row as any).serviceTitle);
    const ownerName = safeTrim((row as any).ownerName);
    const amountUah = Number((row as any).amountUah);
    const createdAt = Number((row as any).createdAt);

    if (!id || !serviceId || !serviceTitle || !ownerName) continue;
    if (!Number.isFinite(amountUah) || amountUah < 0) continue;
    if (!Number.isFinite(createdAt) || createdAt <= 0) continue;

    cleaned.push({
      id,
      serviceId,
      serviceTitle,
      amountUah,
      ownerName,
      ownerPhone: safeTrim((row as any).ownerPhone) || undefined,
      carMake: safeTrim((row as any).carMake) || undefined,
      carModel: safeTrim((row as any).carModel) || undefined,
      carYear: safeYear((row as any).carYear),
      vin: safeTrim((row as any).vin) || undefined,
      plate: safeTrim((row as any).plate) || undefined,
      notes: safeTrim((row as any).notes) || undefined,
      createdAt,
    });
  }

  return cleaned;
}

export function readServiceOrders(): ServiceOrder[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sanitizeOrders(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

export function writeServiceOrders(orders: ServiceOrder[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function addServiceOrder(order: ServiceOrder): void {
  const prev = readServiceOrders();
  writeServiceOrders([order, ...prev]);
}

export function removeServiceOrder(id: string): void {
  const prev = readServiceOrders();
  writeServiceOrders(prev.filter((o) => o.id !== id));
}

export function makeServiceOrderId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
