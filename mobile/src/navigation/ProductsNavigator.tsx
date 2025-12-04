import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsStackParamList } from './types';
import { ProductListScreen } from '../screens/Products/ProductListScreen';
import { ProductDetailScreen } from '../screens/Products/ProductDetailScreen';
import { SearchScreen } from '../screens/Products/SearchScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

const ProductsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.bold as any,
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: 'Ürün Detayı',
          headerBackTitle: 'Geri',
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Ara',
          headerBackTitle: 'Geri',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProductsNavigator;
