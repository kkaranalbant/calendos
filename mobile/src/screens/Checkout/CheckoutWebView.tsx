import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useCart } from '../../hooks/useCart';

type CheckoutWebViewNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CheckoutWebView'
>;

type CheckoutWebViewRouteProp = RouteProp<RootStackParamList, 'CheckoutWebView'>;

interface CheckoutWebViewProps {
  navigation: CheckoutWebViewNavigationProp;
  route: CheckoutWebViewRouteProp;
}

export const CheckoutWebView: React.FC<CheckoutWebViewProps> = ({
  navigation,
  route,
}) => {
  const { checkoutUrl } = route.params;
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);

    // Check if order is completed
    if (navState.url.includes('/thank_you') || navState.url.includes('/orders/')) {
      handleOrderComplete(navState.url);
    }

    // Check if checkout was cancelled
    if (navState.url.includes('/cart')) {
      Alert.alert(
        'Ödeme İptal Edildi',
        'Ödeme işleminiz iptal edildi. Sepetinize dönmek ister misiniz?',
        [
          {
            text: 'Sepete Dön',
            onPress: () => navigation.navigate('Main', { screen: 'Cart' }),
          },
          { text: 'Alışverişe Devam', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  const handleOrderComplete = (url: string) => {
    // Extract order ID from URL if possible
    const orderIdMatch = url.match(/orders\/(\d+)/);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    // Clear cart
    clearCart();

    // Navigate to order confirmation
    if (orderId) {
      navigation.replace('OrderConfirmation', { orderId });
    } else {
      // If we can't extract order ID, just show success message
      Alert.alert(
        'Sipariş Tamamlandı! 🎉',
        'Siparişiniz başarıyla alındı. Teşekkür ederiz!',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Main', { screen: 'Home' }),
          },
        ]
      );
    }
  };

  const handleError = () => {
    Alert.alert(
      'Hata',
      'Ödeme sayfası yüklenirken bir hata oluştu. Lütfen tekrar deneyin.',
      [
        {
          text: 'Tekrar Dene',
          onPress: () => webViewRef.current?.reload(),
        },
        { text: 'Geri Dön', onPress: () => navigation.goBack() },
      ]
    );
  };

  const handleBackPress = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      Alert.alert(
        'Ödemeyi İptal Et',
        'Ödeme işleminden çıkmak istediğinize emin misiniz?',
        [
          { text: 'Hayır', style: 'cancel' },
          { text: 'Evet', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Güvenli Ödeme</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Ödeme sayfası yükleniyor...</Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: checkoutUrl }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={handleError}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityIcon}>🔒</Text>
        <Text style={styles.securityText}>
          Ödeme işleminiz Shopify tarafından güvenli bir şekilde işlenmektedir
        </Text>
      </View>
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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  placeholder: {
    width: 60,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
  },
  webview: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  securityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    flex: 1,
  },
});
