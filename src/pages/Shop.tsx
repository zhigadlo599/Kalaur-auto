import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { PartCondition } from '@/types/shop';
import { useCart } from '@/contexts/CartContext';
import { useCatalog } from '@/hooks/useCatalog';

type CatalogRow = {
  id: string;
  name: string;
  inStock: boolean;
  priceUah?: number;
  condition: PartCondition;
};

function getProductImage(productId: string, condition: PartCondition): string {
  // Use existing local images; keep deterministic mapping.
  const map: Record<string, string> = {
    'new-oil-filter': '/images/services/maintenance.jpg',
    'new-air-filter': '/images/services/diagnostics.jpg',
    'new-brake-pads': '/images/services/brake-system.jpg',
    'new-alternator': '/images/services/electrical.jpg',
    'new-clutch-kit': '/images/services/transmission.jpg',
    'used-starter': '/images/services/electrical.jpg',
    'used-turbo': '/images/services/engine-repair.jpg',
    'used-gearbox': '/images/services/transmission.jpg',
    'used-ecu': '/images/services/diagnostics.jpg',
    'used-headlight': '/images/services/electrical.jpg',
  };

  return map[productId] ?? (condition === 'new' ? '/images/services/maintenance.jpg' : '/images/services/engine-repair.jpg');
}

const ProductTile: React.FC<{ p: CatalogRow; onAdd: () => void }> = ({ p, onAdd }) => {
  const img = getProductImage(p.id, p.condition);

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={img}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-900 border border-gray-200">
            {p.condition === 'new' ? 'Нові' : 'Б/у'}
          </span>
          <span
            className={
              p.inStock
                ? 'rounded-full bg-eco-green-50 px-2.5 py-1 text-xs font-semibold text-eco-green-700 border border-eco-green-100'
                : 'rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-600 border border-gray-200'
            }
          >
            {p.inStock ? 'В наявності' : 'Немає'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2">
            {p.name}
          </h3>
          <div className="shrink-0 text-sm sm:text-base font-bold text-gray-900">
            {p.priceUah ?? 0} грн
          </div>
        </div>

        <div className="mt-4">
          <Button
            disabled={!p.inStock}
            onClick={onAdd}
            className="w-full rounded-full"
          >
            Додати в кошик
          </Button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; condition: PartCondition; catalog: CatalogRow[] }> = ({ title, condition, catalog }) => {
  const { addItem } = useCart();
  const products = useMemo(() => catalog.filter((p) => p.condition === condition).slice(0, 5), [catalog, condition]);

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        <Link to="/cart" className="shrink-0">
          <Button variant="outline" className="rounded-full">Кошик</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {products.map((p) => (
          <ProductTile key={p.id} p={p} onAdd={() => addItem(p.id, 1)} />
        ))}
      </div>
    </section>
  );
};

const Shop: React.FC = () => {
  const { catalog } = useCatalog();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Магазин</h1>
          <p className="text-gray-600">Нові та б/у запчастини. Зараз позиції додані як заготовки для майбутнього наповнення.</p>
        </div>

        <Section title="Нові запчастини" condition="new" catalog={catalog} />
        <Section title="Б/у запчастини" condition="used" catalog={catalog} />
      </div>
    </div>
  );
};

export default Shop;
