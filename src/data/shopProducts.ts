import type { ShopProduct } from '@/types/shop';

export const shopProducts: ShopProduct[] = [
  // Нові запчастини
  { id: 'new-oil-filter', name: 'Фільтр масляний (новий)', condition: 'new', inStock: false, priceUah: 0 },
  { id: 'new-air-filter', name: 'Фільтр повітряний (новий)', condition: 'new', inStock: false, priceUah: 0 },
  { id: 'new-brake-pads', name: 'Гальмівні колодки (нові)', condition: 'new', inStock: false, priceUah: 0 },
  { id: 'new-alternator', name: 'Генератор (новий)', condition: 'new', inStock: false, priceUah: 0 },
  { id: 'new-clutch-kit', name: 'Комплект зчеплення (новий)', condition: 'new', inStock: false, priceUah: 0 },

  // Б/у запчастини
  { id: 'used-starter', name: 'Стартер (б/у)', condition: 'used', inStock: false, priceUah: 0 },
  { id: 'used-turbo', name: 'Турбіна (б/у)', condition: 'used', inStock: false, priceUah: 0 },
  { id: 'used-gearbox', name: 'Коробка передач (б/у)', condition: 'used', inStock: false, priceUah: 0 },
  { id: 'used-ecu', name: 'Блок керування ECU (б/у)', condition: 'used', inStock: false, priceUah: 0 },
  { id: 'used-headlight', name: 'Фара (б/у)', condition: 'used', inStock: false, priceUah: 0 },
];
