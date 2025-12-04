import React from 'react';
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

type AddressListScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'Addresses'
>;

interface AddressListScreenProps {
  navigation: AddressListScreenNavigationProp;
}

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}

interface AddressCardProps {
  address: Address;
  isDefault: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isDefault,
  onEdit,
  onDelete,
  onSetDefault,
}) => (
  <View style={styles.addressCard}>
    <View style={styles.addressHeader}>
      <View style={styles.addressHeaderLeft}>
        <Text style={styles.addressName}>
          {address.firstName} {address.lastName}
        </Text>
        {isDefault && <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Varsayılan</Text>
        </View>}
      </View>
    </View>

    <View style={styles.addressBody}>
      <Text style={styles.addressText}>{address.address1}</Text>
      {address.address2 && <Text style={styles.addressText}>{address.address2}</Text>}
      <Text style={styles.addressText}>
        {address.city}, {address.province} {address.zip}
      </Text>
      <Text style={styles.addressText}>{address.country}</Text>
      {address.phone && <Text style={styles.addressPhone}>📞 {address.phone}</Text>}
    </View>

    <View style={styles.addressActions}>
      <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
        <Text style={styles.actionButtonText}>✏️ Düzenle</Text>
      </TouchableOpacity>

      {!isDefault && (
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={onSetDefault}
        >
          <Text style={styles.actionButtonTextSecondary}>⭐ Varsayılan Yap</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.actionButton, styles.actionButtonDanger]}
        onPress={onDelete}
      >
        <Text style={styles.actionButtonTextDanger}>🗑️ Sil</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const AddressListScreen: React.FC<AddressListScreenProps> = ({ navigation }) => {
  const { addresses, defaultAddress, loading, deleteAddress, setDefaultAddress, deletingAddress, settingDefault } =
    useCustomer();

  const handleDeleteAddress = (addressId: string, addressName: string) => {
    Alert.alert(
      'Adresi Sil',
      `"${addressName}" adresini silmek istediğinize emin misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(addressId);
              Alert.alert('Başarılı', 'Adres silindi');
            } catch (error: any) {
              Alert.alert('Hata', error.message || 'Adres silinirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);
      Alert.alert('Başarılı', 'Varsayılan adres güncellendi');
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Varsayılan adres ayarlanırken bir hata oluştu');
    }
  };

  const handleAddAddress = () => {
    navigation.navigate('AddressForm', { mode: 'add' });
  };

  const handleEditAddress = (address: Address) => {
    navigation.navigate('AddressForm', {
      mode: 'edit',
      addressId: address.id,
      address,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Adresler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📍</Text>
            <Text style={styles.emptyTitle}>Kayıtlı adresiniz yok</Text>
            <Text style={styles.emptySubtitle}>
              Hızlı teslimat için adres ekleyin
            </Text>
          </View>
        ) : (
          addresses.map((address: Address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={defaultAddress?.id === address.id}
              onEdit={() => handleEditAddress(address)}
              onDelete={() =>
                handleDeleteAddress(address.id, `${address.firstName} ${address.lastName}`)
              }
              onSetDefault={() => handleSetDefaultAddress(address.id)}
            />
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddAddress}
          disabled={deletingAddress || settingDefault}
        >
          <Text style={styles.addButtonText}>+ Yeni Adres Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
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
    paddingVertical: theme.spacing.xl * 3,
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
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  addressCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  addressName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textInverse,
  },
  addressBody: {
    marginBottom: theme.spacing.md,
  },
  addressText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  addressActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  actionButtonSecondary: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonDanger: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textInverse,
  },
  actionButtonTextSecondary: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  actionButtonTextDanger: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.error,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
});
