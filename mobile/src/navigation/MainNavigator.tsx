import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/Home';
import ProductsNavigator from './ProductsNavigator';
import { FavoritesScreen } from '../screens/Favorites';
import { CartScreen } from '../screens/Cart/CartScreen';
import { ProfileNavigator } from './ProfileNavigator';
import { theme } from '../theme';
import { useAppSelector } from '../store/hooks';
import { useFavorites } from '../hooks/useFavorites';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const cartItemCount = useAppSelector((state) => state.cart.itemCount);
  const { favoriteCount } = useFavorites();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: theme.spacing.xs,
          paddingBottom: insets.bottom + theme.spacing.xs,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium as any,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold as any,
        },
        headerShadowVisible: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Ana Sayfa',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Ürünler',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🛍️</Text>,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorilerim',
          tabBarLabel: 'Favoriler',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>❤️</Text>,
          tabBarBadge: favoriteCount > 0 ? favoriteCount : undefined,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          title: 'Sepetim',
          tabBarLabel: 'Sepet',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🛒</Text>,
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
