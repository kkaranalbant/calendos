import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';
import { ProfileStackParamList, RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useOrders } from '../../hooks/useOrders';

type OrderHistoryScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, 'Orders'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface OrderHistoryScreenProps {
  navigation: OrderHistoryScreenNavigationProp;
}

interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPriceV2: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
      };
    }>;
  };
}

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'fulfilled':
      return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
    case 'pending':
    case 'unfulfilled':
      return { backgroundColor: '#FFF3E0', color: '#E65100' };
    case 'refunded':
    case 'cancelled':
      return { backgroundColor: '#FFEBEE', color: '#C62828' };
    default:
      return { backgroundColor: '#F5F5F5', color: '#616161' };
  }
};

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    paid: 'Ödendi',
    pending: 'Beklemede',
    refunded: 'İade Edildi',
    fulfilled: 'Teslim Edildi',
    unfulfilled: 'Hazırlanıyor',
    cancelled: 'İptal Edildi',
    partial: 'Kısmi',
  };
  return statusMap[status?.toLowerCase()] || status;
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const orderDate = new Date(order.processedAt);
  const formattedDate = orderDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const itemCount = order.lineItems.edges.reduce((sum, edge) => sum + edge.node.quantity, 0);
  const firstItems = order.lineItems.edges.slice(0, 2);
  const hasMoreItems = order.lineItems.edges.length > 2;

  const financialBadgeStyle = getStatusBadgeStyle(order.financialStatus);
  const fulfillmentBadgeStyle = getStatusBadgeStyle(order.fulfillmentStatus);

  return (
    <TouchableOpacity style={styles.orderCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Sipariş #{order.orderNumber}</Text>
        <Text style={styles.orderPrice}>
          {parseFloat(order.totalPriceV2.amount).toFixed(2)} {order.totalPriceV2.currencyCode === 'TRY' ? '₺' : order.totalPriceV2.currencyCode}
        </Text>
      </View>

      <Text style={styles.orderDate}>{formattedDate}</Text>

      <View style={styles.orderItems}>
        {firstItems.map((edge, index) => (
          <Text key={index} style={styles.orderItemText}>
            • {edge.node.quantity}x {edge.node.title}
          </Text>
        ))}
        {hasMoreItems && (
          <Text style={styles.orderItemMore}>
            +{order.lineItems.edges.length - 2} ürün daha
          </Text>
        )}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: financialBadgeStyle.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: financialBadgeStyle.color }]}>
              {getStatusText(order.financialStatus)}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: fulfillmentBadgeStyle.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: fulfillmentBadgeStyle.color }]}>
              {getStatusText(order.fulfillmentStatus)}
            </Text>
          </View>
        </View>
        <Text style={styles.viewDetails}>Detaylar ›</Text>
      </View>
    </TouchableOpacity>
  );
};

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({ navigation }) => {
  const { orders, loading, hasMore, loadMore, refetch } = useOrders(10);

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetail', { orderId });
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMore();
    }
  };

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={styles.loadMoreContainer}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Daha Fazla Yükle</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>Henüz siparişiniz yok</Text>
      <Text style={styles.emptySubtitle}>
        İlk siparişinizi verin ve taze tropikal meyvelerimizi keşfedin
      </Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Main', { screen: 'Home' })}
      >
        <Text style={styles.shopButtonText}>Alışverişe Başla</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && orders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Siparişler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <OrderCard order={item} onPress={() => handleOrderPress(item.id)} />
        )}
        contentContainerStyle={[
          styles.listContent,
          orders.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading && orders.length > 0}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
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
  orderCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  orderNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  orderPrice: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  orderDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  orderItems: {
    marginBottom: theme.spacing.md,
  },
  orderItemText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: 4,
  },
  orderItemMore: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  viewDetails: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  loadMoreContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  loadMoreButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  loadMoreText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
});
