import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { Button } from '../../components';

type OrderConfirmationNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'OrderConfirmation'
>;

type OrderConfirmationRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;

interface OrderConfirmationScreenProps {
  navigation: OrderConfirmationNavigationProp;
  route: OrderConfirmationRouteProp;
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
  navigation,
  route,
}) => {
  const { orderId } = route.params;

  const handleContinueShopping = () => {
    navigation.navigate('Main', { screen: 'Home' });
  };

  const handleViewOrders = () => {
    navigation.navigate('Main', { screen: 'Profile' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.successIcon}>✓</Text>
      </View>

      {/* Success Message */}
      <Text style={styles.title}>Siparişiniz Alındı!</Text>
      <Text style={styles.subtitle}>
        Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu.
      </Text>

      {/* Order Info */}
      <View style={styles.orderInfoCard}>
        <View style={styles.orderInfoRow}>
          <Text style={styles.orderInfoLabel}>Sipariş Numarası</Text>
          <Text style={styles.orderInfoValue}>#{orderId}</Text>
        </View>
      </View>

      {/* Information Boxes */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>📧</Text>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Onay E-postası Gönderildi</Text>
          <Text style={styles.infoText}>
            Sipariş detaylarınızı e-posta adresinize gönderdik
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>📦</Text>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Kargo Takibi</Text>
          <Text style={styles.infoText}>
            Siparişiniz hazırlandığında kargo takip numaranızı size ileteceğiz
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>🔔</Text>
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoTitle}>Bildirimler</Text>
          <Text style={styles.infoText}>
            Sipariş durumu güncellemeleri için bildirim alacaksınız
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Siparişlerimi Görüntüle"
          onPress={handleViewOrders}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
        <Button
          title="Alışverişe Devam Et"
          onPress={handleContinueShopping}
          fullWidth
          style={styles.actionButton}
        />
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <Text style={styles.helpText}>
          Sorunuz mu var? Müşteri hizmetlerimiz size yardımcı olmak için burada!
        </Text>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>İletişime Geç</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successIcon: {
    fontSize: 60,
    color: theme.colors.success,
    fontWeight: 'bold',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  orderInfoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '100%',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfoLabel: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  orderInfoValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: '100%',
    ...theme.shadows.sm,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    marginBottom: theme.spacing.md,
  },
  helpSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    width: '100%',
  },
  helpText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  helpButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  helpButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
