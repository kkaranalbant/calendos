import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useTheme } from '../../contexts/ThemeContext';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Settings'
>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

interface SettingToggleProps {
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showChevron = true,
  rightElement,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
    disabled={!onPress}
  >
    <View style={styles.settingItemLeft}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    {rightElement || (showChevron && onPress && <Text style={styles.chevron}>›</Text>)}
  </TouchableOpacity>
);

const SettingToggle: React.FC<SettingToggleProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}) => (
  <View style={styles.settingItem}>
    <View style={styles.settingItemLeft}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
      thumbColor="#FFFFFF"
    />
  </View>
);

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { isDark, toggleTheme, colors } = useTheme();

  // Notification settings
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const handleLanguagePress = () => {
    Alert.alert('Dil Seçimi', 'Şu anda sadece Türkçe desteklenmektedir.', [
      { text: 'Tamam' },
    ]);
  };

  const handlePrivacyPress = () => {
    Linking.openURL('https://kalendos.com/privacy');
  };

  const handleTermsPress = () => {
    Linking.openURL('https://kalendos.com/terms');
  };

  const handleHelpPress = () => {
    Linking.openURL('mailto:destek@kalendos.com');
  };

  const handleRatePress = () => {
    Alert.alert('Uygulamamızı Değerlendirin', 'App Store/Play Store\'da değerlendirme yapabilirsiniz.', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Değerlendir', onPress: () => {} },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Önbelleği Temizle',
      'Uygulama önbelleğini temizlemek istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Başarılı', 'Önbellek temizlendi');
          },
        },
      ]
    );
  };

  // Create dynamic styles based on current theme
  const dynamicStyles = StyleSheet.create({
    container: {
      ...styles.container,
      backgroundColor: colors.background,
    },
    section: styles.section,
    sectionTitle: {
      ...styles.sectionTitle,
      color: colors.textSecondary,
    },
    settingsCard: {
      ...styles.settingsCard,
      backgroundColor: colors.card,
    },
    settingTitle: {
      ...styles.settingTitle,
      color: colors.text,
    },
    settingSubtitle: {
      ...styles.settingSubtitle,
      color: colors.textSecondary,
    },
    chevron: {
      ...styles.chevron,
      color: colors.textSecondary,
    },
    divider: {
      ...styles.divider,
      backgroundColor: colors.border,
    },
    footerText: {
      ...styles.footerText,
      color: colors.textSecondary,
    },
  });

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* Notifications */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Bildirimler</Text>
        <View style={dynamicStyles.settingsCard}>
          <SettingToggle
            icon="🔔"
            title="Push Bildirimleri"
            subtitle="Anlık bildirimler al"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <View style={dynamicStyles.divider} />
          <SettingToggle
            icon="📧"
            title="E-posta Bildirimleri"
            subtitle="E-posta ile bildirim al"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
          <View style={dynamicStyles.divider} />
          <SettingToggle
            icon="📦"
            title="Sipariş Güncellemeleri"
            subtitle="Kargo ve teslimat bildirimleri"
            value={orderUpdates}
            onValueChange={setOrderUpdates}
          />
          <View style={dynamicStyles.divider} />
          <SettingToggle
            icon="🎁"
            title="Kampanyalar ve Fırsatlar"
            subtitle="Özel indirim ve kampanyalar"
            value={promotions}
            onValueChange={setPromotions}
          />
        </View>
      </View>

      {/* App Settings */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Uygulama</Text>
        <View style={dynamicStyles.settingsCard}>
          <SettingToggle
            icon="🌙"
            title="Karanlık Mod"
            subtitle="Koyu tema kullan"
            value={isDark}
            onValueChange={toggleTheme}
          />
          <View style={dynamicStyles.divider} />
          <SettingItem
            icon="🌐"
            title="Dil"
            subtitle="Türkçe"
            onPress={handleLanguagePress}
          />
          <View style={dynamicStyles.divider} />
          <SettingItem
            icon="🗑️"
            title="Önbelleği Temizle"
            subtitle="Geçici dosyaları sil"
            onPress={handleClearCache}
          />
        </View>
      </View>

      {/* Legal & Support */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Yasal ve Destek</Text>
        <View style={dynamicStyles.settingsCard}>
          <SettingItem
            icon="🔒"
            title="Gizlilik Politikası"
            subtitle="Veri koruma ve gizlilik"
            onPress={handlePrivacyPress}
          />
          <View style={dynamicStyles.divider} />
          <SettingItem
            icon="📄"
            title="Kullanım Koşulları"
            subtitle="Hizmet şartları"
            onPress={handleTermsPress}
          />
          <View style={dynamicStyles.divider} />
          <SettingItem
            icon="❓"
            title="Yardım ve Destek"
            subtitle="SSS ve iletişim"
            onPress={handleHelpPress}
          />
          <View style={dynamicStyles.divider} />
          <SettingItem
            icon="⭐"
            title="Uygulamayı Değerlendir"
            subtitle="Deneyiminizi paylaşın"
            onPress={handleRatePress}
          />
        </View>
      </View>

      {/* About */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Hakkında</Text>
        <View style={dynamicStyles.settingsCard}>
          <SettingItem
            icon="📱"
            title="Versiyon"
            subtitle="1.0.0"
            showChevron={false}
          />
          <View style={dynamicStyles.divider} />
          <SettingItem
            icon="🏢"
            title="Kalendos"
            subtitle="Taze tropikal meyveler"
            showChevron={false}
          />
          <View style={dynamicStyles.divider} />
          <SettingItem
            icon="©️"
            title="Copyright"
            subtitle="© 2025 Kalendos. Tüm hakları saklıdır."
            showChevron={false}
          />
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          Ayarlarınız cihazınızda güvenli bir şekilde saklanır ve hesabınızla senkronize edilmez.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={dynamicStyles.footerText}>Made with ❤️ in Turkey</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    minHeight: 60,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
    width: 28,
    textAlign: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 56,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: '#1976D2',
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
