/**
 * Shopify Product Types
 */

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney;
  maxVariantPrice: ShopifyMoney;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  priceV2: ShopifyMoney;
  selectedOptions?: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  availableForSale: boolean;
  vendor?: string;
  productType?: string;
  tags?: string[];
  priceRange: ShopifyPriceRange;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyProductVariant;
    }[];
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  description: string;
  handle: string;
  image?: ShopifyImage;
}

/**
 * Helper functions to extract data from Shopify GraphQL responses
 */

export const getProductImages = (product: ShopifyProduct): ShopifyImage[] => {
  return product.images?.edges?.map((edge) => edge.node) || [];
};

export const getProductVariants = (product: ShopifyProduct): ShopifyProductVariant[] => {
  return product.variants?.edges?.map((edge) => edge.node) || [];
};

export const getFirstImage = (product: ShopifyProduct): ShopifyImage | null => {
  const images = getProductImages(product);
  return images.length > 0 ? images[0] : null;
};

export const getDefaultVariant = (product: ShopifyProduct): ShopifyProductVariant | null => {
  const variants = getProductVariants(product);
  return variants.length > 0 ? variants[0] : null;
};

export const formatPrice = (money: ShopifyMoney): string => {
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(amount);
};

export const isProductInStock = (product: ShopifyProduct): boolean => {
  return product.availableForSale;
};
