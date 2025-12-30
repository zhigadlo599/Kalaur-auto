import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useCatalog } from '@/hooks/useCatalog';
import type { ShopProduct } from '@/types/shop';
import { appendSales, makeSaleId } from '@/lib/salesStorage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Cart: React.FC = () => {
  const { items, removeItem, setQuantity, clear } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { catalog, updateOverride } = useCatalog();
  const location = useLocation();
  const navigate = useNavigate();

  const hydrated = useMemo(() => {
    return items
      .map((ci) => {
        const product = catalog.find((p) => p.id === ci.productId);
        if (!product) return null;
        return { ...ci, product };
      })
      .filter(Boolean) as Array<{ productId: string; quantity: number; product: ShopProduct }>;
  }, [items, catalog]);

  const totalUah = useMemo(() => {
    return hydrated.reduce((sum, row) => sum + (row.product.priceUah ?? 0) * row.quantity, 0);
  }, [hydrated]);

  const checkoutDisabled = hydrated.length === 0;

  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [npAvailable, setNpAvailable] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [cities, setCities] = useState<Array<{ ref: string; name: string }>>([]);
  const [cityRef, setCityRef] = useState<string>('');
  const [cityManual, setCityManual] = useState('');
  const [warehouses, setWarehouses] = useState<Array<{ ref: string; name: string }>>([]);
  const [warehouseRef, setWarehouseRef] = useState<string>('');
  const [warehouseManual, setWarehouseManual] = useState('');
  const [shippingCostUah, setShippingCostUah] = useState<number>(0);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [npLoadingCities, setNpLoadingCities] = useState(false);
  const [npLoadingWarehouses, setNpLoadingWarehouses] = useState(false);

  useEffect(() => {
    if (!deliveryOpen) return;
    setDeliveryError(null);
  }, [deliveryOpen]);

  useEffect(() => {
    if (!npAvailable) return;
    const q = cityQuery.trim();
    if (q.length < 2) {
      setCities([]);
      return;
    }

    const handle = window.setTimeout(() => {
      (async () => {
        setNpLoadingCities(true);
        try {
          const res = await fetch('/api/novaposhta/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: q }),
          });

          if (!res.ok) {
            setNpAvailable(false);
            setCities([]);
            return;
          }
          const data = (await res.json()) as { cities?: Array<{ ref: string; name: string }> };
          setCities(Array.isArray(data?.cities) ? data.cities : []);
        } catch {
          setNpAvailable(false);
          setCities([]);
        } finally {
          setNpLoadingCities(false);
        }
      })();
    }, 250);

    return () => window.clearTimeout(handle);
  }, [cityQuery, npAvailable]);

  useEffect(() => {
    if (!npAvailable) return;
    if (!cityRef) {
      setWarehouses([]);
      setWarehouseRef('');
      return;
    }

    (async () => {
      setNpLoadingWarehouses(true);
      try {
        const res = await fetch('/api/novaposhta/warehouses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cityRef }),
        });
        if (!res.ok) {
          setNpAvailable(false);
          setWarehouses([]);
          return;
        }
        const data = (await res.json()) as { warehouses?: Array<{ ref: string; name: string }> };
        setWarehouses(Array.isArray(data?.warehouses) ? data.warehouses : []);
      } catch {
        setNpAvailable(false);
        setWarehouses([]);
      } finally {
        setNpLoadingWarehouses(false);
      }
    })();
  }, [cityRef, npAvailable]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('success') !== '1') return;
    if (hydrated.length === 0) {
      // Clean the URL even if cart is already empty
      navigate('/cart', { replace: true });
      return;
    }

    const fingerprint = JSON.stringify(
      hydrated
        .map((r) => ({ productId: r.productId, quantity: r.quantity, priceUah: r.product.priceUah ?? 0 }))
        .sort((a, b) => a.productId.localeCompare(b.productId))
    );

    const fpKey = 'kalaur_last_checkout_fingerprint_v1';
    const fpTimeKey = 'kalaur_last_checkout_fingerprint_time_v1';
    const last = typeof window !== 'undefined' ? window.localStorage.getItem(fpKey) : null;
    const lastTime = typeof window !== 'undefined' ? Number(window.localStorage.getItem(fpTimeKey) || 0) : 0;
    const now = Date.now();
    const withinTenMinutes = Number.isFinite(lastTime) && now - lastTime < 10 * 60 * 1000;

    if (last === fingerprint && withinTenMinutes) {
      navigate('/cart', { replace: true });
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(fpKey, fingerprint);
        window.localStorage.setItem(fpTimeKey, String(now));
      }
    } catch {
      // ignore
    }

    appendSales(
      hydrated.map((r) => ({
        id: makeSaleId(),
        kind: 'product' as const,
        refId: r.productId,
        quantity: r.quantity,
        amountUah: (r.product.priceUah ?? 0) * r.quantity,
        createdAt: now,
      }))
    );

    for (const r of hydrated) {
      if (typeof r.product.stockQty === 'number') {
        const nextStock = Math.max(0, r.product.stockQty - r.quantity);
        updateOverride(r.productId, { stockQty: nextStock, inStock: nextStock > 0 });
      }
    }

    clear();
    navigate('/cart', { replace: true });
  }, [clear, hydrated, location.search, navigate, updateOverride]);

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

  const handleDeliveryCheckout = async () => {
    setDeliveryError(null);

    if (hydrated.length === 0) {
      setDeliveryError('Кошик порожній');
      return;
    }
    if (recipientName.trim().length < 2) {
      setDeliveryError("Вкажіть ім'я отримувача");
      return;
    }
    if (recipientPhone.trim().length < 6) {
      setDeliveryError('Вкажіть телефон отримувача');
      return;
    }

    const shipping = npAvailable
      ? {
          provider: 'novaposhta' as const,
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          cityRef: cityRef || undefined,
          cityName: cityRef ? (cities.find((c) => c.ref === cityRef)?.name ?? '') : '',
          warehouseRef: warehouseRef || undefined,
          warehouseName: warehouseRef ? (warehouses.find((w) => w.ref === warehouseRef)?.name ?? '') : '',
          shippingCostUah: Number.isFinite(shippingCostUah) ? shippingCostUah : 0,
        }
      : {
          provider: 'novaposhta' as const,
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          cityName: cityManual.trim(),
          warehouseName: warehouseManual.trim(),
          shippingCostUah: Number.isFinite(shippingCostUah) ? shippingCostUah : 0,
        };

    if (npAvailable) {
      if (!shipping.cityRef) {
        setDeliveryError('Оберіть місто');
        return;
      }
      if (!shipping.warehouseRef) {
        setDeliveryError('Оберіть відділення');
        return;
      }
    } else {
      if (shipping.cityName.trim().length < 2) {
        setDeliveryError('Вкажіть місто');
        return;
      }
      if (shipping.warehouseName.trim().length < 2) {
        setDeliveryError('Вкажіть відділення');
        return;
      }
    }

    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: hydrated.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          shipping,
        }),
      });

      if (!res.ok) throw new Error('Checkout failed');
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error('No checkout URL');
      window.location.href = data.url;
    } catch {
      setDeliveryError('Не вдалося відкрити оплату. Перевірте налаштування Stripe.');
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
                  <div className="text-sm text-gray-600">Ціна: {row.product.priceUah ?? 0} грн</div>
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
                <Dialog open={deliveryOpen} onOpenChange={setDeliveryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" disabled={checkoutDisabled || isCheckingOut} className="rounded-full">
                      Купити з доставкою
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Доставка (Нова пошта)</DialogTitle>
                    </DialogHeader>

                    {!npAvailable ? (
                      <div className="text-sm text-gray-600">
                        Пошук Нової пошти недоступний (не налаштований ключ або dev). Заповніть місто та відділення вручну.
                      </div>
                    ) : null}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Отримувач (ПІБ)" />
                      <Input value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} placeholder="Телефон" />
                    </div>

                    {npAvailable ? (
                      <>
                        <Input
                          value={cityQuery}
                          onChange={(e) => {
                            setCityQuery(e.target.value);
                            setCityRef('');
                            setWarehouseRef('');
                          }}
                          placeholder="Почніть вводити місто (наприклад: Львів)"
                        />
                        <Select
                          value={cityRef}
                          onValueChange={(v) => {
                            setCityRef(v);
                            setWarehouseRef('');
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={npLoadingCities ? 'Шукаю міста…' : 'Оберіть місто'} />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((c) => (
                              <SelectItem key={c.ref} value={c.ref}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={warehouseRef} onValueChange={setWarehouseRef}>
                          <SelectTrigger>
                            <SelectValue placeholder={npLoadingWarehouses ? 'Завантажую відділення…' : 'Оберіть відділення'} />
                          </SelectTrigger>
                          <SelectContent>
                            {warehouses.map((w) => (
                              <SelectItem key={w.ref} value={w.ref}>
                                {w.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input value={cityManual} onChange={(e) => setCityManual(e.target.value)} placeholder="Місто" />
                        <Input value={warehouseManual} onChange={(e) => setWarehouseManual(e.target.value)} placeholder="Відділення / Поштомат" />
                      </div>
                    )}

                    <Input
                      type="number"
                      min={0}
                      value={shippingCostUah}
                      onChange={(e) => setShippingCostUah(Number(e.target.value || 0))}
                      placeholder="Вартість доставки (грн, опціонально)"
                    />

                    {deliveryError ? <div className="text-sm text-destructive">{deliveryError}</div> : null}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setDeliveryOpen(false)} className="rounded-full">Скасувати</Button>
                      <Button onClick={handleDeliveryCheckout} disabled={isCheckingOut} className="rounded-full">
                        {isCheckingOut ? 'Відкриваю оплату…' : 'Оплатити та оформити доставку'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button onClick={handleCheckout} disabled={checkoutDisabled || isCheckingOut} className="rounded-full">
                  {isCheckingOut ? 'Відкриваю оплату…' : 'Оплатити (без доставки)'}
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500">Для оплати потрібен налаштований Stripe (STRIPE_SECRET_KEY на Vercel).</p>
      </div>
    </div>
  );
};

export default Cart;
