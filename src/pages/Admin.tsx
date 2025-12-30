import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { clearAdminAuthed, isAdminAuthed, setAdminAuthed, verifyAdminCredentials } from '@/lib/adminAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCatalog } from '@/hooks/useCatalog';
import type { PartCondition } from '@/types/shop';
import { addServiceOrder, makeServiceOrderId, readServiceOrders, removeServiceOrder } from '@/lib/serviceOrdersStorage';
import { makeCarId, readCars, removeCar, upsertCar } from '@/lib/carsStorage';
import { appendSales, makeSaleId, readSales, sumSoldAmount, sumSoldQuantity } from '@/lib/salesStorage';
import { services } from '@/data/services';

const Admin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthed, setIsAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { catalog, updateOverride, reset } = useCatalog();
  const [salesTick, setSalesTick] = useState(0);
  const [serviceOrdersTick, setServiceOrdersTick] = useState(0);
  const [carsTick, setCarsTick] = useState(0);

  const [serviceId, setServiceId] = useState(services[0]?.id ?? '');
  const [serviceAmountUah, setServiceAmountUah] = useState<number>(0);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState<string>('');
  const [vin, setVin] = useState('');
  const [plate, setPlate] = useState('');
  const [notes, setNotes] = useState('');

  const [carOwnerName, setCarOwnerName] = useState('');
  const [carOwnerPhone, setCarOwnerPhone] = useState('');
  const [carMake2, setCarMake2] = useState('');
  const [carModel2, setCarModel2] = useState('');
  const [carYear2, setCarYear2] = useState<string>('');
  const [vin2, setVin2] = useState('');
  const [plate2, setPlate2] = useState('');
  const [carNotes, setCarNotes] = useState('');

  const sales = useMemo(() => readSales(), [salesTick]);
  const serviceOrders = useMemo(() => readServiceOrders(), [serviceOrdersTick]);
  const cars = useMemo(() => readCars(), [carsTick]);

  const serviceTotals = useMemo(() => {
    const now = Date.now();
    const ids = services.map((s) => s.id);
    const sumAll = (window: 'day' | 'week' | 'year') =>
      ids.reduce((acc, id) => acc + sumSoldAmount({ sales, kind: 'service', refId: id, window, now }), 0);
    const countAll = (window: 'day' | 'week' | 'year') =>
      ids.reduce((acc, id) => acc + sumSoldQuantity({ sales, kind: 'service', refId: id, window, now }), 0);

    return {
      day: { count: countAll('day'), amount: sumAll('day') },
      week: { count: countAll('week'), amount: sumAll('week') },
      year: { count: countAll('year'), amount: sumAll('year') },
    };
  }, [sales, salesTick]);

  const addServiceSale = () => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    const amount = Number(serviceAmountUah);
    if (!Number.isFinite(amount) || amount < 0) return;
    if (ownerName.trim().length === 0) return;

    const now = Date.now();
    addServiceOrder({
      id: makeServiceOrderId(),
      serviceId: svc.id,
      serviceTitle: svc.title,
      amountUah: amount,
      ownerName: ownerName.trim(),
      ownerPhone: ownerPhone.trim() || undefined,
      carMake: carMake.trim() || undefined,
      carModel: carModel.trim() || undefined,
      carYear: carYear.trim() ? Math.trunc(Number(carYear)) : undefined,
      vin: vin.trim() || undefined,
      plate: plate.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: now,
    });

    appendSales([
      {
        id: makeSaleId(),
        kind: 'service',
        refId: svc.id,
        quantity: 1,
        amountUah: amount,
        createdAt: now,
      },
    ]);

    setServiceOrdersTick((t) => t + 1);
    setSalesTick((t) => t + 1);
    setOwnerName('');
    setOwnerPhone('');
    setCarMake('');
    setCarModel('');
    setCarYear('');
    setVin('');
    setPlate('');
    setNotes('');
    setServiceAmountUah(0);
  };

  const addCar = () => {
    if (carOwnerName.trim().length === 0) return;
    const now = Date.now();
    upsertCar({
      id: makeCarId(),
      ownerName: carOwnerName.trim(),
      ownerPhone: carOwnerPhone.trim() || undefined,
      make: carMake2.trim() || undefined,
      model: carModel2.trim() || undefined,
      year: carYear2.trim() ? Math.trunc(Number(carYear2)) : undefined,
      vin: vin2.trim() || undefined,
      plate: plate2.trim() || undefined,
      notes: carNotes.trim() || undefined,
      createdAt: now,
    });

    setCarsTick((t) => t + 1);
    setCarOwnerName('');
    setCarOwnerPhone('');
    setCarMake2('');
    setCarModel2('');
    setCarYear2('');
    setVin2('');
    setPlate2('');
    setCarNotes('');
  };

  useEffect(() => {
    setIsAuthed(isAdminAuthed());
  }, []);

  const login = () => {
    setError(null);
    (async () => {
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
          // Local fallback (e.g. Vite dev without Vercel functions)
          if (import.meta.env.DEV && verifyAdminCredentials(username, password)) {
            setAdminAuthed();
            setIsAuthed(true);
            return;
          }

          setError('Невірний логін або пароль');
          return;
        }

        setAdminAuthed();
        setIsAuthed(true);
      } catch {
        // Local fallback (e.g. Vite dev without Vercel functions)
        if (!verifyAdminCredentials(username, password)) {
          setError('Невірний логін або пароль');
          return;
        }
        setAdminAuthed();
        setIsAuthed(true);
      }
    })();
  };

  const logout = () => {
    (async () => {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch {
        // ignore
      } finally {
        clearAdminAuthed();
        setIsAuthed(false);
        setUsername('');
        setPassword('');
        setError(null);
      }
    })();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Адмін</h1>
          <p className="text-gray-600">
            Ця сторінка потрібна для керування магазином та налаштування оплати.
          </p>
        </div>

        {!isAuthed ? (
          <Card className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Вхід</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                Захист тут лише від випадкового відкриття (логін/пароль видно в коді, бо це SPA).
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError(null);
                  }}
                  placeholder="Логін"
                  autoComplete="off"
                />
                <Input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Пароль"
                  type="password"
                  autoComplete="off"
                />
              </div>
              {error ? <div className="text-sm text-destructive">{error}</div> : null}
              <div>
                <Button onClick={login} className="rounded-full">Увійти</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Керування магазином</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div className="flex flex-wrap gap-2">
                  <Link to="/shop"><Button variant="outline" className="rounded-full">Відкрити магазин</Button></Link>
                  <Link to="/cart"><Button variant="outline" className="rounded-full">Відкрити кошик</Button></Link>
                  <Button variant="outline" onClick={logout} className="rounded-full">Вийти</Button>
                  <Button variant="outline" onClick={() => setSalesTick((t) => t + 1)} className="rounded-full">Оновити статистику</Button>
                </div>

                <div className="text-xs text-gray-500">
                  Зміни зберігаються в браузері (localStorage) і впливають на магазин/кошик. Ціни тут не редагуються,
                  щоб оплата Stripe залишалась коректною.
                </div>

                <div className="space-y-3">
                  {catalog.map((p) => (
                    <div key={p.id} className="rounded-xl border border-eco-green-100/40 bg-white p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="text-xs text-gray-500">ID: {p.id}</div>
                          <Input
                            value={p.name}
                            onChange={(e) => updateOverride(p.id, { name: e.target.value })}
                            className="bg-white"
                          />

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              value={p.sku ?? ''}
                              onChange={(e) => updateOverride(p.id, { sku: e.target.value })}
                              className="bg-white"
                              placeholder="Номер товару / SKU"
                            />
                            <Input
                              value={p.imageUrl ?? ''}
                              onChange={(e) => updateOverride(p.id, { imageUrl: e.target.value })}
                              className="bg-white"
                              placeholder="Фото (URL)"
                            />
                          </div>

                          <Textarea
                            value={p.description ?? ''}
                            onChange={(e) => updateOverride(p.id, { description: e.target.value })}
                            className="bg-white"
                            placeholder="Опис товару"
                            rows={3}
                          />

                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                            <span>
                              Продано: день — {sumSoldQuantity({ sales, kind: 'product', refId: p.id, window: 'day' })}
                            </span>
                            <span>
                              тиждень — {sumSoldQuantity({ sales, kind: 'product', refId: p.id, window: 'week' })}
                            </span>
                            <span>
                              рік — {sumSoldQuantity({ sales, kind: 'product', refId: p.id, window: 'year' })}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={p.inStock}
                              onChange={(e) => updateOverride(p.id, { inStock: e.target.checked })}
                              className="h-4 w-4 rounded border border-eco-green-200"
                            />
                            <span className="text-sm">В наявності</span>
                          </div>

                          <div className="min-w-[140px]">
                            <Input
                              type="number"
                              min={0}
                              value={typeof p.stockQty === 'number' ? p.stockQty : ''}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const n = raw === '' ? null : Math.max(0, Math.trunc(Number(raw)));
                                if (n === null || Number.isNaN(n)) {
                                  updateOverride(p.id, { stockQty: 0 });
                                  return;
                                }
                                updateOverride(p.id, { stockQty: n });
                              }}
                              className="bg-white"
                              placeholder="На складі"
                            />
                          </div>

                          <div className="min-w-[160px]">
                            <Select
                              value={p.condition}
                              onValueChange={(v) => updateOverride(p.id, { condition: v as PartCondition })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Тип" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">Нові</SelectItem>
                                <SelectItem value="used">Б/у</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="text-sm font-semibold text-gray-900">
                            {p.priceUah ?? 0} грн
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Button variant="outline" onClick={reset} className="rounded-full">Скинути до стандартних</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Продаж сервісних послуг</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div className="text-xs text-gray-500">
                  Підходить для швидкого обліку робіт/замовлень. Дані зберігаються в браузері.
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => { setServiceOrdersTick((t) => t + 1); setSalesTick((t) => t + 1); }} className="rounded-full">
                    Оновити
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <span>День: {serviceTotals.day.count} зам. / {Math.round(serviceTotals.day.amount)} грн</span>
                  <span>Тиждень: {serviceTotals.week.count} зам. / {Math.round(serviceTotals.week.amount)} грн</span>
                  <span>Рік: {serviceTotals.year.count} зам. / {Math.round(serviceTotals.year.amount)} грн</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Select value={serviceId} onValueChange={setServiceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Послуга" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      min={0}
                      value={serviceAmountUah}
                      onChange={(e) => setServiceAmountUah(Number(e.target.value || 0))}
                      placeholder="Сума (грн)"
                      className="bg-white"
                    />

                    <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Власник (ПІБ)" className="bg-white" />
                    <Input value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="Телефон" className="bg-white" />
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input value={carMake} onChange={(e) => setCarMake(e.target.value)} placeholder="Марка" className="bg-white" />
                      <Input value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="Модель" className="bg-white" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input value={carYear} onChange={(e) => setCarYear(e.target.value)} placeholder="Рік" className="bg-white" />
                      <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="Номер" className="bg-white" />
                    </div>
                    <Input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="VIN" className="bg-white" />
                    <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Нотатки" className="bg-white" rows={2} />
                  </div>
                </div>

                <div>
                  <Button onClick={addServiceSale} className="rounded-full">Додати продаж послуги</Button>
                </div>

                <div className="space-y-2">
                  {serviceOrders.slice(0, 20).map((o) => (
                    <div key={o.id} className="rounded-xl border border-eco-green-100/40 bg-white p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">{o.serviceTitle} — {o.amountUah} грн</div>
                          <div className="text-xs text-gray-600">
                            {o.ownerName}{o.ownerPhone ? `, ${o.ownerPhone}` : ''}
                            {o.plate ? ` • ${o.plate}` : ''}
                            {o.vin ? ` • VIN ${o.vin}` : ''}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            removeServiceOrder(o.id);
                            setServiceOrdersTick((t) => t + 1);
                          }}
                        >
                          Видалити
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">База авто та власників</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Input value={carOwnerName} onChange={(e) => setCarOwnerName(e.target.value)} placeholder="Власник (ПІБ)" className="bg-white" />
                    <Input value={carOwnerPhone} onChange={(e) => setCarOwnerPhone(e.target.value)} placeholder="Телефон" className="bg-white" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input value={carMake2} onChange={(e) => setCarMake2(e.target.value)} placeholder="Марка" className="bg-white" />
                      <Input value={carModel2} onChange={(e) => setCarModel2(e.target.value)} placeholder="Модель" className="bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input value={carYear2} onChange={(e) => setCarYear2(e.target.value)} placeholder="Рік" className="bg-white" />
                      <Input value={plate2} onChange={(e) => setPlate2(e.target.value)} placeholder="Номер" className="bg-white" />
                    </div>
                    <Input value={vin2} onChange={(e) => setVin2(e.target.value)} placeholder="VIN" className="bg-white" />
                    <Textarea value={carNotes} onChange={(e) => setCarNotes(e.target.value)} placeholder="Нотатки" className="bg-white" rows={2} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={addCar} className="rounded-full">Додати авто</Button>
                  <Button variant="outline" onClick={() => setCarsTick((t) => t + 1)} className="rounded-full">Оновити</Button>
                </div>

                <div className="space-y-2">
                  {cars.slice(0, 30).map((c) => (
                    <div key={c.id} className="rounded-xl border border-eco-green-100/40 bg-white p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {c.ownerName}{c.ownerPhone ? `, ${c.ownerPhone}` : ''}
                          </div>
                          <div className="text-xs text-gray-600">
                            {[c.make, c.model, c.year ? String(c.year) : ''].filter(Boolean).join(' ')}
                            {c.plate ? ` • ${c.plate}` : ''}
                            {c.vin ? ` • VIN ${c.vin}` : ''}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => {
                            removeCar(c.id);
                            setCarsTick((t) => t + 1);
                          }}
                        >
                          Видалити
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Оплата (Visa/Mastercard)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <div>
                  Оплата працює через Stripe Checkout. На хостингу потрібно додати змінну середовища <span className="font-semibold">STRIPE_SECRET_KEY</span>.
                </div>
                <div className="text-xs text-gray-500">
                  Після оплати Stripe повертає на <span className="font-semibold">/cart?success=1</span>.
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Vercel Commerce (vercel/commerce)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <div>
                  Vercel Commerce — це окремий Next.js storefront (переважно під Shopify). Адмінка там не всередині сайту —
                  керування товарами робиться в адмінці Shopify (або іншого провайдера).
                </div>
                <div className="text-xs text-gray-500">
                  Якщо хочете міграцію на Shopify + Vercel Commerce, скажіть — підготую окремий проєкт і перенесемо дизайн.
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
