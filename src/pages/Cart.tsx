import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { shopProducts } from '@/data/shopProducts';

const Cart: React.FC = () => {
  const { items, removeItem, setQuantity, clear } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const hydrated = useMemo(() => {
    return items
      .map((ci) => {
        const product = shopProducts.find((p) => p.id === ci.productId);
        if (!product) return null;
        return { ...ci, product };
      })
      .filter(Boolean) as Array<{ productId: string; quantity: number; product: (typeof shopProducts)[number] }>;
  }, [items]);

  const totalUah = useMemo(() => {
    return hydrated.reduce((sum, row) => sum + (row.product.priceUah ?? 0) * row.quantity, 0);
  }, [hydrated]);

  const checkoutDisabled = hydrated.length === 0;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: hydrated.map((i) => ({ productId: i.productId, quantity: i.quantity }))
        })
      });

      if (!res.ok) throw new Error('Checkout failed');
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error('No checkout URL');
      window.location.href = data.url;
    } catch {
      alert('Не вдалося відкрити оплату. Перевірте налаштування Stripe.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Кошик</h1>
            <p className="text-gray-600">Оформлення замовлення (Visa / Mastercard через Stripe).</p>
          </div>
          <Link to="/shop" className="shrink-0">
            <Button variant="outline" className="rounded-full">До магазину</Button>
          </Link>
        </div>

        {hydrated.length === 0 ? (
          <Card className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
            <CardContent className="p-8 text-center text-gray-600">Кошик порожній</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {hydrated.map((row) => (
              <Card key={row.productId} className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-gray-900">{row.product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-sm text-gray-600">К-сть: </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={row.quantity}
                      onChange={(e) => setQuantity(row.productId, Number(e.target.value))}
                      className="w-20 rounded-md border border-gray-200 px-3 py-2 text-sm"
                    />
                    <Button variant="outline" onClick={() => removeItem(row.productId)} className="rounded-full">
                      Видалити
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-gray-900 font-semibold">Разом: {totalUah} грн</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clear} className="rounded-full">Очистити</Button>
                <Button onClick={handleCheckout} disabled={checkoutDisabled || isCheckingOut} className="rounded-full">
                  {isCheckingOut ? 'Відкриваю оплату…' : 'Оплатити (Visa/Mastercard)'}
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">Оплата активується, коли товари будуть в наявності та налаштовані ціни/Stripe.</p>
      </div>
    </div>
  );
};

export default Cart;
