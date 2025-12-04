import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  customerAccessToken: string | null;
  tokenExpiresAt: string | null;
  customerId: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  customerAccessToken: null,
  tokenExpiresAt: null,
  customerId: null,
  email: null,
  firstName: null,
  lastName: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        customerAccessToken: string;
        tokenExpiresAt: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.customerAccessToken = action.payload.customerAccessToken;
      state.tokenExpiresAt = action.payload.tokenExpiresAt;
      state.error = null;

      // Save to AsyncStorage
      AsyncStorage.setItem('customerAccessToken', action.payload.customerAccessToken);
      AsyncStorage.setItem('tokenExpiresAt', action.payload.tokenExpiresAt);
    },
    setCustomerInfo: (
      state,
      action: PayloadAction<{
        customerId: string;
        email: string;
        firstName?: string;
        lastName?: string;
      }>
    ) => {
      state.customerId = action.payload.customerId;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName || null;
      state.lastName = action.payload.lastName || null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.customerAccessToken = null;
      state.tokenExpiresAt = null;
      state.customerId = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.error = null;

      // Clear AsyncStorage
      AsyncStorage.multiRemove([
        'customerAccessToken',
        'tokenExpiresAt',
        'customerId',
        'email',
      ]);
    },
    restoreAuth: (
      state,
      action: PayloadAction<{
        customerAccessToken: string;
        tokenExpiresAt: string;
      }>
    ) => {
      state.isAuthenticated = true;
      state.customerAccessToken = action.payload.customerAccessToken;
      state.tokenExpiresAt = action.payload.tokenExpiresAt;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  setCustomerInfo,
  logout,
  restoreAuth,
} = authSlice.actions;

export default authSlice.reducer;
