import type { CartItem } from '@/types/shop';

const STORAGE_KEY = 'kalaur.cart.v1';

export const readCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is CartItem => {
        if (!item || typeof item !== 'object') return false;
        const maybe = item as any;
        return typeof maybe.productId === 'string' && typeof maybe.quantity === 'number' && Number.isFinite(maybe.quantity);
      })
      .map((item) => ({ productId: item.productId, quantity: Math.max(1, Math.floor(item.quantity)) }));
  } catch {
    return [];
  }
};

export const writeCart = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};
