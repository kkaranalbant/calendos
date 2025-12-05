import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useFavorites, FavoriteProduct } from '../../hooks/useFavorites';

type FavoritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Favorites'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface FavoritesScreenProps {
  navigation: FavoritesScreenNavigationProp;
}

interface FavoriteItemProps {
  item: FavoriteProduct;
  onPress: () => void;
  onRemove: () => void;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ item, onPress, onRemove }) => {
  const imageUrl = item.images?.edges?.[0]?.node?.url;
  const price = parseFloat(item.priceRange.minVariantPrice.amount);
  const currency = item.priceRange.minVariantPrice.currencyCode;

  return (
    <TouchableOpacity style={styles.favoriteItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📦</Text>
          </View>
        )}
      </View>

      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.itemPrice}>
          {price.toFixed(2)} {currency === 'TRY' ? '₺' : currency}
        </Text>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeIcon}>❌</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { favorites, loading, removeFavorite, clearFavorites, loadFavorites } = useFavorites();

  // Reload favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Favoriler ekranı odaklandı - favoriler yeniden yükleniyor');
      loadFavorites();
    }, [])
  );

  const handleProductPress = (handle: string) => {
    navigation.navigate('ProductDetail', { handle });
  };

  const handleRemove = (productId: string, productTitle: string) => {
    Alert.alert('Favorilerden Çıkar', `"${productTitle}" favorilerden çıkarılsın mı?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkar',
        style: 'destructive',
        onPress: () => removeFavorite(productId),
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Tüm Favorileri Temizle',
      'Tüm favori ürünler silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: () => clearFavorites(),
        },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💔</Text>
      <Text style={styles.emptyTitle}>Favori ürününüz yok</Text>
      <Text style={styles.emptySubtitle}>
        Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.shopButtonText}>Alışverişe Başla</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Favoriler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favorites.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{favorites.length} Favori Ürün</Text>
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={styles.clearButton}>Tümünü Temizle</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            onPress={() => handleProductPress(item.handle)}
            onRemove={() => handleRemove(item.id, item.title)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  clearButton: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.error,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
  },
  shopButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  itemPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  removeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing.sm,
  },
  removeIcon: {
    fontSize: 20,
  },
});
