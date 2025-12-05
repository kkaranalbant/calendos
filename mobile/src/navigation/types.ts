import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Root Stack Navigator Params
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { handle: string };
  CheckoutWebView: { checkoutUrl: string };
  OrderConfirmation: { orderId: string };
  OrderDetail: { orderId: string };
};

/**
 * Auth Stack Navigator Params
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/**
 * Main Tab Navigator Params
 */
export type MainTabParamList = {
  Home: undefined;
  Products: NavigatorScreenParams<ProductsStackParamList>;
  Favorites: undefined;
  Cart: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

/**
 * Products Stack Navigator Params
 */
export type ProductsStackParamList = {
  ProductList: { collectionHandle?: string } | undefined;
  ProductDetail: { handle: string };
  Search: undefined;
};

/**
 * Profile Stack Navigator Params
 */
export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  Orders: undefined;
  Addresses: undefined;
  AddressForm:
    | { mode: 'add' }
    | {
        mode: 'edit';
        addressId: string;
        address: {
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
        };
      };
  Settings: undefined;
};
