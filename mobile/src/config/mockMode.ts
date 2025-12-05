/**
 * Mock Mode Configuration
 *
 * Bu dosya uygulamanın mock mode'da mı yoksa gerçek Shopify API ile mi
 * çalışacağını kontrol eder.
 *
 * Prototip geliştirme için USE_MOCK_DATA=true yapın.
 * Canlı ortam için USE_MOCK_DATA=false yapın ve Shopify token'larını ekleyin.
 */

import { USE_MOCK_DATA, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '@env';

/**
 * Mock mode aktif mi kontrol et
 * - Eğer USE_MOCK_DATA=true ise mock mode kullan
 * - Eğer Shopify token yoksa otomatik mock mode'a geç
 */
export const IS_MOCK_MODE =
  USE_MOCK_DATA === 'true' ||
  !SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  SHOPIFY_STOREFRONT_ACCESS_TOKEN.trim() === '';

/**
 * Console'a mock mode durumunu yazdır
 */
if (__DEV__) {
  console.log('🔧 Mock Mode:', IS_MOCK_MODE ? 'AKTIF ✅' : 'KAPALI ❌');
  console.log('📦 Veri Kaynağı:', IS_MOCK_MODE ? 'Mock Data' : 'Shopify API');
}

export default IS_MOCK_MODE;
