import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

const FloatingCartButton: React.FC = () => {
  const { items } = useCart();
  const location = useLocation();

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const hidden = location.pathname === '/cart';

  if (hidden) return null;

  return (
    <Link
      to="/cart"
      aria-label="Відкрити кошик"
      className={cn(
        'fixed bottom-5 right-5 z-[120] flex items-center justify-center',
        'w-14 h-14 rounded-full bg-eco-green-500 text-white',
        'shadow-[0_10px_25px_rgba(0,0,0,0.18)] hover:bg-eco-green-600 transition-colors'
      )}
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-6 h-6 px-1 rounded-full bg-white text-eco-green-700 text-xs font-bold flex items-center justify-center border border-eco-green-100">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
};

export default FloatingCartButton;
