import { useMutation, useLazyQuery } from '@apollo/client';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginSuccess,
  setCustomerInfo,
  logout as logoutAction,
  setLoading,
  setError,
} from '../store/slices/authSlice';
import {
  CUSTOMER_CREATE,
  CUSTOMER_ACCESS_TOKEN_CREATE,
  CUSTOMER_ACCESS_TOKEN_DELETE,
  CUSTOMER_RECOVER,
} from '../shopify/mutations/customer.mutations';
import { GET_CUSTOMER } from '../shopify/queries/customer.queries';
import { tokenStorage } from '../utils/tokenStorage';
import { MOCK_TEST_USER, MOCK_CUSTOMER } from '../shopify/mockData';
import IS_MOCK_MODE from '../config/mockMode';

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  // GraphQL Mutations
  const [createCustomer] = useMutation(CUSTOMER_CREATE);
  const [createAccessToken] = useMutation(CUSTOMER_ACCESS_TOKEN_CREATE);
  const [deleteAccessToken] = useMutation(CUSTOMER_ACCESS_TOKEN_DELETE);
  const [recoverCustomer] = useMutation(CUSTOMER_RECOVER);

  // GraphQL Queries
  const [getCustomer] = useLazyQuery(GET_CUSTOMER);

  /**
   * Register new customer
   */
  const register = async (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Create customer
      const result = await createCustomer({
        variables: {
          input: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            acceptsMarketing: false,
          },
        },
      });

      const { customer, customerUserErrors } = result.data.customerCreate;

      if (customerUserErrors && customerUserErrors.length > 0) {
        const errorMessage = customerUserErrors[0].message;
        dispatch(setError(errorMessage));
        throw new Error(errorMessage);
      }

      if (customer) {
        // Auto-login after registration
        await login({ email: data.email, password: data.password });
        return { success: true, customer };
      }

      throw new Error('Kayıt başarısız oldu');
    } catch (error: any) {
      const errorMessage = error.message || 'Kayıt sırasında bir hata oluştu';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Login customer
   */
  const login = async (data: { email: string; password: string }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      // Mock Mode
      if (IS_MOCK_MODE) {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Check credentials
        if (
          data.email === MOCK_TEST_USER.email &&
          data.password === MOCK_TEST_USER.password
        ) {
          const mockAccessToken = 'mock_access_token_' + Date.now();
          const mockExpiresAt = new Date(Date.now() + 86400000).toISOString();

          // Save to Redux
          dispatch(
            loginSuccess({
              customerAccessToken: mockAccessToken,
              tokenExpiresAt: mockExpiresAt,
            })
          );

          dispatch(
            setCustomerInfo({
              customerId: MOCK_CUSTOMER.id,
              email: MOCK_CUSTOMER.email,
              firstName: MOCK_CUSTOMER.firstName,
              lastName: MOCK_CUSTOMER.lastName,
            })
          );

          // Save to AsyncStorage
          await tokenStorage.saveAuth({
            accessToken: mockAccessToken,
            expiresAt: mockExpiresAt,
            email: data.email,
            customerId: MOCK_CUSTOMER.id,
            firstName: MOCK_CUSTOMER.firstName,
            lastName: MOCK_CUSTOMER.lastName,
          });

          dispatch(setLoading(false));
          return { success: true, accessToken: mockAccessToken };
        } else {
          dispatch(setLoading(false));
          const errorMessage = 'E-posta veya şifre hatalı';
          dispatch(setError(errorMessage));
          throw new Error(errorMessage);
        }
      }

      // Real Mode
      // Get access token
      const result = await createAccessToken({
        variables: {
          input: {
            email: data.email,
            password: data.password,
          },
        },
      });

      const { customerAccessToken, customerUserErrors } =
        result.data.customerAccessTokenCreate;

      if (customerUserErrors && customerUserErrors.length > 0) {
        const errorMessage = customerUserErrors[0].message;
        dispatch(setError(errorMessage));
        throw new Error(errorMessage);
      }

      if (customerAccessToken) {
        const { accessToken, expiresAt } = customerAccessToken;

        // Save to Redux
        dispatch(loginSuccess({ customerAccessToken: accessToken, tokenExpiresAt: expiresAt }));

        // Save to AsyncStorage
        await tokenStorage.saveAuth({
          accessToken,
          expiresAt,
          email: data.email,
        });

        // Fetch customer details
        await fetchCustomerDetails(accessToken);

        return { success: true, accessToken };
      }

      throw new Error('Giriş başarısız oldu');
    } catch (error: any) {
      const errorMessage = error.message || 'Giriş sırasında bir hata oluştu';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Fetch customer details
   */
  const fetchCustomerDetails = async (accessToken: string) => {
    try {
      const result = await getCustomer({
        variables: { customerAccessToken: accessToken },
      });

      const customer = result.data?.customer;

      if (customer) {
        dispatch(
          setCustomerInfo({
            customerId: customer.id,
            email: customer.email,
            firstName: customer.firstName,
            lastName: customer.lastName,
          })
        );

        // Update storage with customer info
        await tokenStorage.saveAuth({
          accessToken,
          expiresAt: authState.tokenExpiresAt || '',
          customerId: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
        });
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  /**
   * Logout customer
   */
  const logout = async () => {
    try {
      dispatch(setLoading(true));

      // Mock Mode - Skip API call
      if (!IS_MOCK_MODE) {
        // Delete access token from Shopify
        if (authState.customerAccessToken) {
          await deleteAccessToken({
            variables: {
              customerAccessToken: authState.customerAccessToken,
            },
          });
        }
      }

      // Clear local storage
      await tokenStorage.clearAuth();

      // Clear Redux state
      dispatch(logoutAction());
    } catch (error) {
      console.error('Error logging out:', error);
      // Still clear local state even if API call fails
      await tokenStorage.clearAuth();
      dispatch(logoutAction());
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Forgot password - Send recovery email
   */
  const forgotPassword = async (email: string) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const result = await recoverCustomer({
        variables: { email },
      });

      const { customerUserErrors } = result.data.customerRecover;

      if (customerUserErrors && customerUserErrors.length > 0) {
        const errorMessage = customerUserErrors[0].message;
        dispatch(setError(errorMessage));
        throw new Error(errorMessage);
      }

      return { success: true };
    } catch (error: any) {
      const errorMessage = error.message || 'Şifre sıfırlama başarısız oldu';
      dispatch(setError(errorMessage));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  /**
   * Restore authentication from storage
   */
  const restoreAuth = async () => {
    try {
      const authData = await tokenStorage.getAuth();

      if (authData.accessToken && authData.expiresAt) {
        // Check if token is expired
        const isExpired = await tokenStorage.isTokenExpired();

        if (!isExpired) {
          dispatch(
            loginSuccess({
              customerAccessToken: authData.accessToken,
              tokenExpiresAt: authData.expiresAt,
            })
          );

          if (authData.customerId && authData.email) {
            const nameParts = authData.customerName?.split(' ') || [];
            dispatch(
              setCustomerInfo({
                customerId: authData.customerId,
                email: authData.email,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' '),
              })
            );
          } else {
            // Fetch customer details if not in storage
            await fetchCustomerDetails(authData.accessToken);
          }

          return true;
        } else {
          // Token expired, clear storage
          await tokenStorage.clearAuth();
        }
      }

      return false;
    } catch (error) {
      console.error('Error restoring auth:', error);
      return false;
    }
  };

  return {
    // State
    ...authState,
    // Actions
    register,
    login,
    logout,
    forgotPassword,
    restoreAuth,
  };
};
