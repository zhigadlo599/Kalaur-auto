export type CarRecord = {
  id: string;
  ownerName: string;
  ownerPhone?: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  plate?: string;
  notes?: string;
  createdAt: number;
};

const STORAGE_KEY = 'kalaur_cars_v1';

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

function sanitizeCars(input: unknown): CarRecord[] {
  if (!Array.isArray(input)) return [];
  const cleaned: CarRecord[] = [];

  for (const row of input) {
    if (!isRecord(row)) continue;
    const id = safeTrim(row.id);
    const ownerName = safeTrim(row.ownerName);
    const createdAt = Number((row as any).createdAt);
    if (!id || !ownerName || !Number.isFinite(createdAt) || createdAt <= 0) continue;

    cleaned.push({
      id,
      ownerName,
      ownerPhone: safeTrim((row as any).ownerPhone) || undefined,
      make: safeTrim((row as any).make) || undefined,
      model: safeTrim((row as any).model) || undefined,
      year: safeYear((row as any).year),
      vin: safeTrim((row as any).vin) || undefined,
      plate: safeTrim((row as any).plate) || undefined,
      notes: safeTrim((row as any).notes) || undefined,
      createdAt,
    });
  }

  return cleaned;
}

export function readCars(): CarRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return sanitizeCars(JSON.parse(raw) as unknown);
  } catch {
    return [];
  }
}

export function writeCars(cars: CarRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
}

export function upsertCar(car: CarRecord): void {
  const prev = readCars();
  const without = prev.filter((c) => c.id !== car.id);
  writeCars([car, ...without]);
}

export function removeCar(id: string): void {
  const prev = readCars();
  writeCars(prev.filter((c) => c.id !== id));
}

export function makeCarId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
