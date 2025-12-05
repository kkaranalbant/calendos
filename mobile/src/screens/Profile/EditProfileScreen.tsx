import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useCustomer } from '../../hooks/useCustomer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { validateEmail, validatePhone } from '../../utils/validation';

type EditProfileScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'EditProfile'
>;

interface EditProfileScreenProps {
  navigation: EditProfileScreenNavigationProp;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const { customer, updateCustomer, updating, loading } = useCustomer();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptsMarketing, setAcceptsMarketing] = useState(false);

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (customer) {
      setFirstName(customer.firstName || '');
      setLastName(customer.lastName || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setAcceptsMarketing(customer.acceptsMarketing || false);
    }
  }, [customer]);

  const validateForm = (): boolean => {
    console.log('🔍 validateForm başladı');
    const newErrors: typeof errors = {};

    console.log('Checking firstName:', firstName);
    if (!firstName.trim()) {
      newErrors.firstName = 'İsim gereklidir';
      console.log('❌ firstName hatası');
    }

    console.log('Checking lastName:', lastName);
    if (!lastName.trim()) {
      newErrors.lastName = 'Soyisim gereklidir';
      console.log('❌ lastName hatası');
    }

    console.log('Checking email:', email);
    if (!email.trim()) {
      newErrors.email = 'E-posta gereklidir';
      console.log('❌ email boş');
    } else if (!validateEmail(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
      console.log('❌ email format hatası');
    }

    console.log('Checking phone:', phone);
    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
      console.log('❌ phone format hatası');
    }

    console.log('📋 Toplanan hatalar:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('✅ Form geçerli mi?', isValid);
    return isValid;
  };

  const handleSave = async () => {
    console.log('🔵 handleSave çağrıldı');
    console.log('📝 Form verileri:', {
      firstName,
      lastName,
      email,
      phone,
    });

    const isValid = validateForm();
    console.log('🔍 Form geçerli mi?', isValid);
    console.log('❌ Validasyon hataları:', errors);

    if (!isValid) {
      console.log('❌ Form validasyon hatası - işlem iptal');
      Alert.alert(
        'Form Hatası',
        'Lütfen tüm zorunlu alanları doğru şekilde doldurun:\n' +
          Object.entries(errors)
            .map(([key, value]) => `• ${value}`)
            .join('\n')
      );
      return;
    }

    console.log('✅ Form geçerli, updateCustomer çağrılıyor...');

    try {
      const result = await updateCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        acceptsMarketing,
      });

      console.log('✅ updateCustomer başarılı:', result);

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi', [
        {
          text: 'Tamam',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('❌ Hata:', error);
      Alert.alert('Hata', error.message || 'Profil güncellenirken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>

        <Input
          label="İsim"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="İsminiz"
          error={errors.firstName}
          autoCapitalize="words"
        />

        <Input
          label="Soyisim"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Soyisminiz"
          error={errors.lastName}
          autoCapitalize="words"
        />

        <Input
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          placeholder="ornek@email.com"
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Telefon (Opsiyonel)"
          value={phone}
          onChangeText={setPhone}
          placeholder="+90 5XX XXX XX XX"
          error={errors.phone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tercihler</Text>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptsMarketing(!acceptsMarketing)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, acceptsMarketing && styles.checkboxChecked]}>
            {acceptsMarketing && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxTextContainer}>
            <Text style={styles.checkboxLabel}>Kampanya ve indirim haberleri</Text>
            <Text style={styles.checkboxSubtitle}>
              E-posta ve SMS ile özel fırsatlardan haberdar ol
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>ℹ️</Text>
        <Text style={styles.infoText}>
          E-posta adresinizi değiştirmek için lütfen müşteri hizmetleri ile iletişime geçin.
        </Text>
      </View>

      <Button
        title="Değişiklikleri Kaydet"
        onPress={handleSave}
        loading={updating}
        style={styles.saveButton}
      />

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={updating}
      >
        <Text style={styles.cancelButtonText}>İptal</Text>
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: theme.colors.textInverse,
    fontSize: 16,
    fontWeight: theme.typography.fontWeight.bold,
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  checkboxSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
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
  saveButton: {
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
});
