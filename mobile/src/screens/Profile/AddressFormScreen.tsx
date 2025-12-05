import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { useCustomer } from '../../hooks/useCustomer';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { validatePhone } from '../../utils/validation';

type AddressFormScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'AddressForm'
>;

type AddressFormScreenRouteProp = RouteProp<ProfileStackParamList, 'AddressForm'>;

interface AddressFormScreenProps {
  navigation: AddressFormScreenNavigationProp;
  route: AddressFormScreenRouteProp;
}

export const AddressFormScreen: React.FC<AddressFormScreenProps> = ({ navigation, route }) => {
  const { mode, address, addressId } = route.params;
  const { createAddress, updateAddress, creatingAddress, updatingAddress } = useCustomer();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('Türkiye');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    address1?: string;
    city?: string;
    province?: string;
    zip?: string;
    phone?: string;
  }>({});

  useEffect(() => {
    if (mode === 'edit' && address) {
      setFirstName(address.firstName || '');
      setLastName(address.lastName || '');
      setAddress1(address.address1 || '');
      setAddress2(address.address2 || '');
      setCity(address.city || '');
      setProvince(address.province || '');
      setCountry(address.country || 'Türkiye');
      setZip(address.zip || '');
      setPhone(address.phone || '');
    }
  }, [mode, address]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'İsim gereklidir';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Soyisim gereklidir';
    }

    if (!address1.trim()) {
      newErrors.address1 = 'Adres gereklidir';
    }

    if (!city.trim()) {
      newErrors.city = 'Şehir gereklidir';
    }

    if (!province.trim()) {
      newErrors.province = 'İlçe/Bölge gereklidir';
    }

    if (!zip.trim()) {
      newErrors.zip = 'Posta kodu gereklidir';
    } else if (!/^\d{5}$/.test(zip.trim())) {
      newErrors.zip = 'Geçerli bir posta kodu giriniz (5 haneli)';
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    console.log('🔵 AddressForm handleSave çağrıldı, mode:', mode);
    console.log('📝 Form verileri:', {
      firstName,
      lastName,
      address1,
      city,
      province,
      zip,
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

    const addressData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address1: address1.trim(),
      address2: address2.trim() || undefined,
      city: city.trim(),
      province: province.trim(),
      country: country.trim(),
      zip: zip.trim(),
      phone: phone.trim() || undefined,
    };

    console.log('✅ Form geçerli, adres verisi:', addressData);

    try {
      if (mode === 'add') {
        console.log('➕ createAddress çağrılıyor...');
        const result = await createAddress(addressData);
        console.log('✅ createAddress başarılı:', result);
        Alert.alert('Başarılı', 'Adres eklendi', [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else if (mode === 'edit' && addressId) {
        console.log('✏️ updateAddress çağrılıyor, addressId:', addressId);
        const result = await updateAddress(addressId, addressData);
        console.log('✅ updateAddress başarılı:', result);
        Alert.alert('Başarılı', 'Adres güncellendi', [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error: any) {
      console.error('❌ Hata:', error);
      Alert.alert('Hata', error.message || 'Adres kaydedilirken bir hata oluştu');
    }
  };

  const isLoading = creatingAddress || updatingAddress;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kişi Bilgileri</Text>

        <Input
          label="İsim"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Alıcı ismi"
          error={errors.firstName}
          autoCapitalize="words"
        />

        <Input
          label="Soyisim"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Alıcı soyismi"
          error={errors.lastName}
          autoCapitalize="words"
        />

        <Input
          label="Telefon"
          value={phone}
          onChangeText={setPhone}
          placeholder="+90 5XX XXX XX XX"
          error={errors.phone}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adres Bilgileri</Text>

        <Input
          label="Adres Satır 1"
          value={address1}
          onChangeText={setAddress1}
          placeholder="Sokak, mahalle, bina no"
          error={errors.address1}
          multiline
        />

        <Input
          label="Adres Satır 2 (Opsiyonel)"
          value={address2}
          onChangeText={setAddress2}
          placeholder="Daire no, kat vb."
          multiline
        />

        <Input
          label="Şehir"
          value={city}
          onChangeText={setCity}
          placeholder="İstanbul"
          error={errors.city}
          autoCapitalize="words"
        />

        <Input
          label="İlçe/Bölge"
          value={province}
          onChangeText={setProvince}
          placeholder="Kadıköy"
          error={errors.province}
          autoCapitalize="words"
        />

        <Input
          label="Posta Kodu"
          value={zip}
          onChangeText={setZip}
          placeholder="34000"
          error={errors.zip}
          keyboardType="numeric"
          maxLength={5}
        />

        <Input
          label="Ülke"
          value={country}
          onChangeText={setCountry}
          placeholder="Türkiye"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>📍</Text>
        <Text style={styles.infoText}>
          Adres bilgileriniz sadece teslimat için kullanılır ve güvenli bir şekilde saklanır.
        </Text>
      </View>

      <Button
        title={mode === 'add' ? 'Adresi Ekle' : 'Değişiklikleri Kaydet'}
        onPress={handleSave}
        loading={isLoading}
        style={styles.saveButton}
      />

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={isLoading}
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: '#E8F5E9',
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
    color: '#2E7D32',
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
