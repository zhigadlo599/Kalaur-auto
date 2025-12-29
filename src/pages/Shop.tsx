import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { shopProducts } from '@/data/shopProducts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { PartCondition } from '@/types/shop';

const Section: React.FC<{ title: string; condition: PartCondition }> = ({ title, condition }) => {
  const products = useMemo(() => shopProducts.filter((p) => p.condition === condition).slice(0, 5), [condition]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        <Link to="/cart" className="shrink-0">
          <Button variant="outline" className="rounded-full">Кошик</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id} className="bg-white/90 backdrop-blur-sm border border-eco-green-100/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-900">{p.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">Немає в наявності</div>
              <Button disabled className="w-full rounded-full">Додати в кошик</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const Shop: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Магазин</h1>
          <p className="text-gray-600">Нові та б/у запчастини. Зараз позиції додані як заготовки для майбутнього наповнення.</p>
        </div>

        <Section title="Нові запчастини" condition="new" />
        <Section title="Б/у запчастини" condition="used" />
      </div>
    </div>
  );
};

export default Shop;
