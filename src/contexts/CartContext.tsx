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

  const persist = useCallback((updater: (prev: CartItem[]) => CartItem[]) => {
    setItems((prev) => {
      const next = updater(prev);
      if (typeof window !== 'undefined') writeCart(next);
      return next;
    });
  }, []);

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const safeQty = Math.max(1, Math.floor(quantity));
      persist((prev) => {
        const existing = prev.find((i) => i.productId === productId);
        if (!existing) return [...prev, { productId, quantity: safeQty }];
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + safeQty } : i));
      });
    },
    [persist]
  );

  const removeItem = useCallback(
    (productId: string) => {
      persist((prev) => prev.filter((i) => i.productId !== productId));
    },
    [persist]
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number) => {
      const safeQty = Math.max(1, Math.floor(quantity));
      persist((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: safeQty } : i)));
    },
    [persist]
  );

  const clear = useCallback(() => {
    persist(() => []);
  }, [persist]);

  const value = useMemo<CartContextValue>(() => ({ items, addItem, removeItem, setQuantity, clear }), [items, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
