import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { theme } from '../theme';
import {
  ShopifyProduct,
  formatPrice,
  getFirstImage,
  isProductInStock,
} from '../shopify/types/product.types';
import { useFavorites } from '../hooks/useFavorites';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;

interface ProductCardProps {
  product: ShopifyProduct;
  onPress: () => void;
  variant?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  variant = 'grid',
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const image = getFirstImage(product);
  const inStock = isProductInStock(product);
  const minPrice = formatPrice(product.priceRange.minVariantPrice);
  const maxPrice = formatPrice(product.priceRange.maxVariantPrice);
  const priceDisplay = minPrice === maxPrice ? minPrice : `${minPrice} - ${maxPrice}`;

  const favoriteProduct = {
    id: product.id,
    handle: product.handle,
    title: product.title,
    priceRange: product.priceRange,
    images: product.images,
  };

  const handleFavoriteToggle = (e: any) => {
    e.stopPropagation();
    toggleFavorite(favoriteProduct);
  };

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={styles.listContainer}
        onPress={onPress}
        activeOpacity={0.7}>
        <Image
          source={{ uri: image?.url || 'https://via.placeholder.com/150' }}
          style={styles.listImage}
          resizeMode="cover"
        />
        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={2}>
            {product.title}
          </Text>
          {product.description && (
            <Text style={styles.listDescription} numberOfLines={2}>
              {product.description}
            </Text>
          )}
          <View style={styles.listFooter}>
            <Text style={styles.listPrice}>{priceDisplay}</Text>
            {!inStock && (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Stokta Yok</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Grid variant
  return (
    <TouchableOpacity
      style={styles.gridContainer}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image?.url || 'https://via.placeholder.com/150' }}
          style={styles.gridImage}
          resizeMode="cover"
        />
        {!inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockOverlayText}>Stokta Yok</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite(product.id) ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.gridPrice}>{priceDisplay}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Grid styles
  gridContainer: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockOverlayText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  gridContent: {
    padding: theme.spacing.sm,
  },
  gridTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    minHeight: 36,
  },
  gridPrice: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },

  // List styles
  listContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  listImage: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  listContent: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  listDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  outOfStockBadge: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  outOfStockText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  favoriteIcon: {
    fontSize: 20,
  },
});
