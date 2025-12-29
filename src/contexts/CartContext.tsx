import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { CartItem } from '@/types/shop';
import { readCart, writeCart } from '@/lib/cartStorage';

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => (typeof window === 'undefined' ? [] : readCart()));

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    if (typeof window !== 'undefined') writeCart(next);
  }, []);

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const safeQty = Math.max(1, Math.floor(quantity));
      persist(
        (() => {
          const existing = items.find((i) => i.productId === productId);
          if (!existing) return [...items, { productId, quantity: safeQty }];
          return items.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + safeQty } : i));
        })()
      );
    },
    [items, persist]
  );

  const removeItem = useCallback(
    (productId: string) => {
      persist(items.filter((i) => i.productId !== productId));
    },
    [items, persist]
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const safeQty = Math.max(1, Math.floor(quantity));
      persist(items.map((i) => (i.productId === productId ? { ...i, quantity: safeQty } : i)));
    },
    [items, persist]
  );

  const clear = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo<CartContextValue>(() => ({ items, addItem, removeItem, setQuantity, clear }), [items, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
