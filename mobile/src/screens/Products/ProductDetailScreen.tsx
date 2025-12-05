import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { Button } from '../../components';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../hooks/useFavorites';
import {
  getProductImages,
  getProductVariants,
  formatPrice,
  isProductInStock,
} from '../../shopify/types/product.types';

const { width } = Dimensions.get('window');

type ProductDetailNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ProductDetail'
>;

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

interface ProductDetailScreenProps {
  navigation: ProductDetailNavigationProp;
  route: ProductDetailRouteProp;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { handle } = route.params;
  const { product, loading, error } = useProduct(handle);
  const { addToCart, loading: addingToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ürün yüklenemedi</Text>
        <Button
          title="Geri Dön"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </View>
    );
  }

  const images = getProductImages(product);
  const variants = getProductVariants(product);
  const selectedVariant = variants[selectedVariantIndex];
  const inStock = isProductInStock(product);

  const favoriteProduct = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    priceRange: product.priceRange,
    images: product.images,
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(favoriteProduct);
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${product.title} - Kalendos'tan taze tropikal meyveler!\n\nFiyat: ${formatPrice(selectedVariant.price)}\n\nDetaylar için: https://kalendos.com/products/${product.handle}`,
        url: `https://kalendos.com/products/${product.handle}`,
        title: product.title,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared via:', result.activityType);
        }
      }
    } catch (error: any) {
      Alert.alert('Hata', 'Paylaşım sırasında bir hata oluştu');
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(selectedVariant.id, quantity);
      Alert.alert(
        'Sepete Eklendi! 🎉',
        `${product.title} sepetinize eklendi.`,
        [
          { text: 'Alışverişe Devam', style: 'cancel' },
          {
            text: 'Sepete Git',
            onPress: () => navigation.navigate('Main', { screen: 'Cart' }),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Hata',
        'Ürün sepete eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Image Gallery */}
        <View style={styles.imageGallery}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setSelectedImageIndex(index);
            }}>
            {images.map((image) => (
              <Image
                key={image.id}
                source={{ uri: image.url }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Share Button */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Text style={styles.shareIcon}>📤</Text>
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Text style={styles.favoriteIcon}>
              {isFavorite(product.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>

          {/* Image indicators */}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === selectedImageIndex && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.content}>
          {/* Title and Price */}
          <View style={styles.header}>
            <Text style={styles.title}>{product.title}</Text>
            <Text style={styles.price}>
              {formatPrice(selectedVariant.priceV2)}
            </Text>
          </View>

          {/* Stock Status */}
          {!inStock && (
            <View style={styles.outOfStockBanner}>
              <Text style={styles.outOfStockText}>⚠️ Stokta Yok</Text>
            </View>
          )}

          {/* Variants */}
          {variants.length > 1 && (
            <View style={styles.variantsSection}>
              <Text style={styles.sectionTitle}>Seçenekler</Text>
              <View style={styles.variantsGrid}>
                {variants.map((variant, index) => (
                  <TouchableOpacity
                    key={variant.id}
                    style={[
                      styles.variantButton,
                      index === selectedVariantIndex &&
                        styles.variantButtonActive,
                      !variant.availableForSale &&
                        styles.variantButtonDisabled,
                    ]}
                    onPress={() => setSelectedVariantIndex(index)}
                    disabled={!variant.availableForSale}>
                    <Text
                      style={[
                        styles.variantText,
                        index === selectedVariantIndex &&
                          styles.variantTextActive,
                        !variant.availableForSale &&
                          styles.variantTextDisabled,
                      ]}>
                      {variant.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Ürün Açıklaması</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Product Details */}
          {product.vendor && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Marka:</Text>
              <Text style={styles.detailValue}>{product.vendor}</Text>
            </View>
          )}

          {product.productType && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kategori:</Text>
              <Text style={styles.detailValue}>{product.productType}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <Button
          title={addingToCart ? 'Ekleniyor...' : (inStock ? 'Sepete Ekle' : 'Stokta Yok')}
          onPress={handleAddToCart}
          disabled={!inStock || !selectedVariant.availableForSale || addingToCart}
          fullWidth
          size="large"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
  },
  imageGallery: {
    width,
    height: width,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  productImage: {
    width,
    height: width,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: theme.colors.textInverse,
  },
  content: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  price: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  outOfStockBanner: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  outOfStockText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  variantsSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  variantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  variantButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    margin: theme.spacing.xs,
  },
  variantButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '20',
  },
  variantButtonDisabled: {
    borderColor: theme.colors.disabled,
    backgroundColor: theme.colors.disabledBackground,
  },
  variantText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  variantTextActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  variantTextDisabled: {
    color: theme.colors.disabled,
    textDecorationLine: 'line-through',
  },
  descriptionSection: {
    marginBottom: theme.spacing.lg,
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.sm,
    minWidth: 80,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    flex: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  shareButton: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  shareIcon: {
    fontSize: 24,
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  favoriteIcon: {
    fontSize: 24,
  },
});
