export type PartCondition = 'new' | 'used';

export type ShopProduct = {
  id: string;
  name: string;
  condition: PartCondition;
  inStock: boolean;
  priceUah?: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};
