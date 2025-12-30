export type PartCondition = 'new' | 'used';

export type ShopProduct = {
  id: string;
  name: string;
  condition: PartCondition;
  inStock: boolean;
  priceUah?: number;
  sku?: string;
  description?: string;
  imageUrl?: string;
  stockQty?: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
