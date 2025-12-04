import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import { theme } from '../theme';
import {
  ProfileScreen,
  EditProfileScreen,
  AddressListScreen,
  AddressFormScreen,
  OrderHistoryScreen,
  SettingsScreen,
} from '../screens/Profile';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={{
          title: 'Profil',
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Profili Düzenle',
          headerBackTitle: 'Geri',
        }}
      />
      <Stack.Screen
        name="Addresses"
        component={AddressListScreen}
        options={{
          title: 'Adreslerim',
          headerBackTitle: 'Geri',
        }}
      />
      <Stack.Screen
        name="AddressForm"
        component={AddressFormScreen}
        options={({ route }) => ({
          title: route.params.mode === 'add' ? 'Adres Ekle' : 'Adres Düzenle',
          headerBackTitle: 'Geri',
        })}
      />
      <Stack.Screen
        name="Orders"
        component={OrderHistoryScreen}
        options={{
          title: 'Siparişlerim',
          headerBackTitle: 'Geri',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          headerBackTitle: 'Geri',
        }}
      />
    </Stack.Navigator>
  );
};
