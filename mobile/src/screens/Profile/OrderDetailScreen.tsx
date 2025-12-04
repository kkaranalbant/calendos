import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useOrder } from '../../hooks/useOrders';

type OrderDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderDetail'
>;

type OrderDetailScreenRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

interface OrderDetailScreenProps {
  navigation: OrderDetailScreenNavigationProp;
  route: OrderDetailScreenRouteProp;
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

export const OrderDetailScreen: React.FC<OrderDetailScreenProps> = ({ navigation, route }) => {
  const { orderId } = route.params;
  const { order, loading, error } = useOrder(orderId);

  const handleContactSupport = () => {
    Linking.openURL('mailto:destek@kalendos.com');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Sipariş detayları yükleniyor...</Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>❌</Text>
        <Text style={styles.errorText}>Sipariş detayları yüklenemedi</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const orderDate = new Date(order.processedAt);
  const formattedDate = orderDate.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const financialBadgeStyle = getStatusBadgeStyle(order.financialStatus);
  const fulfillmentBadgeStyle = getStatusBadgeStyle(order.fulfillmentStatus);

  const subtotal = parseFloat(order.subtotalPriceV2?.amount || order.totalPriceV2.amount);
  const tax = parseFloat(order.totalTaxV2?.amount || '0');
  const shipping = parseFloat(order.totalShippingPriceV2?.amount || '0');
  const total = parseFloat(order.totalPriceV2.amount);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Order Header */}
      <View style={styles.headerCard}>
        <Text style={styles.orderNumber}>Sipariş #{order.orderNumber}</Text>
        <Text style={styles.orderDate}>{formattedDate}</Text>
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
      </View>

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sipariş Ürünleri</Text>
        <View style={styles.card}>
          {order.lineItems.edges.map((edge: any, index: number) => {
            const item = edge.node;
            const itemTotal = parseFloat(item.originalTotalPrice?.amount || '0');
            return (
              <View key={index}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.orderItem}>
                  <View style={styles.orderItemLeft}>
                    <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                    <View style={styles.orderItemInfo}>
                      <Text style={styles.orderItemTitle}>{item.title}</Text>
                      {item.variant?.title && item.variant.title !== 'Default Title' && (
                        <Text style={styles.orderItemVariant}>{item.variant.title}</Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.orderItemPrice}>
                    {itemTotal.toFixed(2)} {order.totalPriceV2.currencyCode === 'TRY' ? '₺' : order.totalPriceV2.currencyCode}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Teslimat Adresi</Text>
          <View style={styles.card}>
            <Text style={styles.addressName}>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </Text>
            <Text style={styles.addressText}>{order.shippingAddress.address1}</Text>
            {order.shippingAddress.address2 && (
              <Text style={styles.addressText}>{order.shippingAddress.address2}</Text>
            )}
            <Text style={styles.addressText}>
              {order.shippingAddress.city}, {order.shippingAddress.province}{' '}
              {order.shippingAddress.zip}
            </Text>
            <Text style={styles.addressText}>{order.shippingAddress.country}</Text>
            {order.shippingAddress.phone && (
              <Text style={styles.addressPhone}>📞 {order.shippingAddress.phone}</Text>
            )}
          </View>
        </View>
      )}

      {/* Tracking Info */}
      {order.fulfillments?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kargo Takip</Text>
          {order.fulfillments.map((fulfillment: any, index: number) => (
            <View key={index} style={styles.card}>
              <View style={styles.trackingRow}>
                <Text style={styles.trackingLabel}>Kargo Şirketi:</Text>
                <Text style={styles.trackingValue}>
                  {fulfillment.trackingCompany || 'Belirtilmedi'}
                </Text>
              </View>
              {fulfillment.trackingNumber && (
                <>
                  <View style={styles.trackingRow}>
                    <Text style={styles.trackingLabel}>Takip No:</Text>
                    <Text style={styles.trackingValue}>{fulfillment.trackingNumber}</Text>
                  </View>
                  {fulfillment.trackingUrl && (
                    <TouchableOpacity
                      style={styles.trackButton}
                      onPress={() => Linking.openURL(fulfillment.trackingUrl)}
                    >
                      <Text style={styles.trackButtonText}>Kargoyu Takip Et</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Order Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ara Toplam:</Text>
            <Text style={styles.summaryValue}>
              {subtotal.toFixed(2)} {order.totalPriceV2.currencyCode === 'TRY' ? '₺' : order.totalPriceV2.currencyCode}
            </Text>
          </View>
          {shipping > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Kargo:</Text>
              <Text style={styles.summaryValue}>
                {shipping.toFixed(2)} {order.totalPriceV2.currencyCode === 'TRY' ? '₺' : order.totalPriceV2.currencyCode}
              </Text>
            </View>
          )}
          {tax > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>KDV:</Text>
              <Text style={styles.summaryValue}>
                {tax.toFixed(2)} {order.totalPriceV2.currencyCode === 'TRY' ? '₺' : order.totalPriceV2.currencyCode}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Toplam:</Text>
            <Text style={styles.summaryTotalValue}>
              {total.toFixed(2)} {order.totalPriceV2.currencyCode === 'TRY' ? '₺' : order.totalPriceV2.currencyCode}
            </Text>
          </View>
        </View>
      </View>

      {/* Help Card */}
      <View style={styles.helpCard}>
        <Text style={styles.helpIcon}>💬</Text>
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpTitle}>Yardıma mı ihtiyacınız var?</Text>
          <Text style={styles.helpText}>
            Siparişinizle ilgili sorularınız için müşteri hizmetlerimizle iletişime geçin
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
        <Text style={styles.supportButtonText}>Müşteri Hizmetleri</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  headerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  orderNumber: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  orderDate: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  orderItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  orderItemQuantity: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
    minWidth: 30,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemTitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    marginBottom: 2,
  },
  orderItemVariant: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  orderItemPrice: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  addressName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  addressText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  addressPhone: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  trackingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  trackingLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  trackingValue: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  trackButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  trackButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textInverse,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
  },
  summaryTotalLabel: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  summaryTotalValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  helpIcon: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  helpTextContainer: {
    flex: 1,
  },
  helpTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: '#E65100',
    marginBottom: 2,
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: '#E65100',
    lineHeight: 18,
  },
  supportButton: {
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
});
