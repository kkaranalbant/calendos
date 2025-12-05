/**
 * Kalendos Mobile App
 * E-commerce app for tropical fruits
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store/store';
import shopifyClient from './src/shopify/client';
import mockClient from './src/shopify/mockClient';
import IS_MOCK_MODE from './src/config/mockMode';
import RootNavigator from './src/navigation/RootNavigator';
import { tokenStorage } from './src/utils/tokenStorage';
import { restoreAuth } from './src/store/slices/authSlice';
import { theme } from './src/theme';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Mock mode ise mock client kullan, değilse gerçek Shopify client'ı kullan
const apolloClient = IS_MOCK_MODE ? mockClient : shopifyClient;

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore authentication on app start
    const initializeApp = async () => {
      try {
        const authData = await tokenStorage.getAuth();

        if (authData.accessToken && authData.expiresAt) {
          // Check if token is expired
          const isExpired = await tokenStorage.isTokenExpired();

          if (!isExpired) {
            store.dispatch(
              restoreAuth({
                customerAccessToken: authData.accessToken,
                tokenExpiresAt: authData.expiresAt,
              })
            );
          } else {
            // Token expired, clear storage
            await tokenStorage.clearAuth();
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <RootNavigator />;
};

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ReduxProvider store={store}>
            <ApolloProvider client={apolloClient}>
              <AppContent />
            </ApolloProvider>
          </ReduxProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});

export default App;
