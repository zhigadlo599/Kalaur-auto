import type { ShopProduct } from '../types/shop';

export const shopProducts: ShopProduct[] = [
  // Нові запчастини
  { id: 'new-oil-filter', name: 'Фільтр масляний (новий)', condition: 'new', inStock: true, priceUah: 450 },
  { id: 'new-air-filter', name: 'Фільтр повітряний (новий)', condition: 'new', inStock: true, priceUah: 520 },
  { id: 'new-brake-pads', name: 'Гальмівні колодки (нові)', condition: 'new', inStock: true, priceUah: 1850 },
  { id: 'new-alternator', name: 'Генератор (новий)', condition: 'new', inStock: true, priceUah: 7200 },
  { id: 'new-clutch-kit', name: 'Комплект зчеплення (новий)', condition: 'new', inStock: true, priceUah: 9800 },

  // Б/у запчастини
  { id: 'used-starter', name: 'Стартер (б/у)', condition: 'used', inStock: true, priceUah: 2100 },
  { id: 'used-turbo', name: 'Турбіна (б/у)', condition: 'used', inStock: true, priceUah: 6500 },
  { id: 'used-gearbox', name: 'Коробка передач (б/у)', condition: 'used', inStock: true, priceUah: 18500 },
  { id: 'used-ecu', name: 'Блок керування ECU (б/у)', condition: 'used', inStock: true, priceUah: 3200 },
  { id: 'used-headlight', name: 'Фара (б/у)', condition: 'used', inStock: true, priceUah: 1200 },
];
