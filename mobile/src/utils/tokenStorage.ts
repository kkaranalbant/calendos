import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys
 */
const STORAGE_KEYS = {
  CUSTOMER_ACCESS_TOKEN: 'customerAccessToken',
  TOKEN_EXPIRES_AT: 'tokenExpiresAt',
  CUSTOMER_ID: 'customerId',
  CUSTOMER_EMAIL: 'email',
  CUSTOMER_NAME: 'customerName',
};

/**
 * Token storage utilities
 */
export const tokenStorage = {
  /**
   * Save authentication data
   */
  saveAuth: async (data: {
    accessToken: string;
    expiresAt: string;
    customerId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<void> => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN, data.accessToken],
        [STORAGE_KEYS.TOKEN_EXPIRES_AT, data.expiresAt],
        ...(data.customerId
          ? [[STORAGE_KEYS.CUSTOMER_ID, data.customerId]]
          : []),
        ...(data.email ? [[STORAGE_KEYS.CUSTOMER_EMAIL, data.email]] : []),
        ...(data.firstName || data.lastName
          ? [[
              STORAGE_KEYS.CUSTOMER_NAME,
              `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            ]]
          : []),
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  },

  /**
   * Get authentication data
   */
  getAuth: async (): Promise<{
    accessToken: string | null;
    expiresAt: string | null;
    customerId: string | null;
    email: string | null;
    customerName: string | null;
  }> => {
    try {
      const values = await AsyncStorage.multiGet([
        STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRES_AT,
        STORAGE_KEYS.CUSTOMER_ID,
        STORAGE_KEYS.CUSTOMER_EMAIL,
        STORAGE_KEYS.CUSTOMER_NAME,
      ]);

      return {
        accessToken: values[0][1],
        expiresAt: values[1][1],
        customerId: values[2][1],
        email: values[3][1],
        customerName: values[4][1],
      };
    } catch (error) {
      console.error('Error getting auth data:', error);
      return {
        accessToken: null,
        expiresAt: null,
        customerId: null,
        email: null,
        customerName: null,
      };
    }
  },

  /**
   * Get access token
   */
  getAccessToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: async (): Promise<boolean> => {
    try {
      const expiresAt = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
      if (!expiresAt) {
        return true;
      }
      return new Date(expiresAt) <= new Date();
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  },

  /**
   * Clear all authentication data
   */
  clearAuth: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN,
        STORAGE_KEYS.TOKEN_EXPIRES_AT,
        STORAGE_KEYS.CUSTOMER_ID,
        STORAGE_KEYS.CUSTOMER_EMAIL,
        STORAGE_KEYS.CUSTOMER_NAME,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },
};
