import type { PartCondition, ShopProduct } from '../types/shop';
import { shopProducts } from '../data/shopProducts';

export type CatalogOverride = {
  id: string;
  name?: string;
  inStock?: boolean;
  condition?: PartCondition;
  sku?: string;
  description?: string;
  imageUrl?: string;
  stockQty?: number;
};

const STORAGE_KEY = 'kalaur_catalog_overrides_v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCondition(value: unknown): value is PartCondition {
  return value === 'new' || value === 'used';
}

function safeNonNegativeInt(value: unknown): number | null {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const i = Math.trunc(n);
  if (i < 0) return null;
  return i;
}

export function readCatalogOverrides(): CatalogOverride[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    const allowedIds = new Set(shopProducts.map((p) => p.id));

    const cleaned: CatalogOverride[] = [];
    for (const row of parsed) {
      if (!isRecord(row)) continue;
      const id = String(row.id || '');
      if (!allowedIds.has(id)) continue;

      const override: CatalogOverride = { id };
      if (typeof row.name === 'string' && row.name.trim().length > 0) override.name = row.name;
      if (typeof row.inStock === 'boolean') override.inStock = row.inStock;
      if (isCondition(row.condition)) override.condition = row.condition;
      if (typeof row.sku === 'string' && row.sku.trim().length > 0) override.sku = row.sku.trim();
      if (typeof row.description === 'string' && row.description.trim().length > 0) override.description = row.description;
      if (typeof row.imageUrl === 'string' && row.imageUrl.trim().length > 0) override.imageUrl = row.imageUrl.trim();
      const stockQty = safeNonNegativeInt((row as any).stockQty);
      if (stockQty !== null) override.stockQty = stockQty;

      cleaned.push(override);
    }
    return cleaned;
  } catch {
    return [];
  }
}

export function writeCatalogOverrides(overrides: CatalogOverride[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function clearCatalogOverrides(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function mergeCatalog(base: ShopProduct[], overrides: CatalogOverride[]): ShopProduct[] {
  const map = new Map(overrides.map((o) => [o.id, o] as const));
  return base.map((p) => {
    const o = map.get(p.id);
    if (!o) return p;
    return {
      ...p,
      name: typeof o.name === 'string' ? o.name : p.name,
      inStock: typeof o.inStock === 'boolean' ? o.inStock : p.inStock,
      condition: o.condition ?? p.condition,
      sku: typeof o.sku === 'string' ? o.sku : p.sku,
      description: typeof o.description === 'string' ? o.description : p.description,
      imageUrl: typeof o.imageUrl === 'string' ? o.imageUrl : p.imageUrl,
      stockQty: typeof o.stockQty === 'number' ? o.stockQty : p.stockQty,
      // priceUah stays from base to keep Stripe serverless pricing consistent
      priceUah: p.priceUah,
    };
  });
}

export function getCatalogMerged(): ShopProduct[] {
  return mergeCatalog(shopProducts, readCatalogOverrides());
}
