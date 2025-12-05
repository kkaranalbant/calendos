import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../store/hooks';
import { GET_CUSTOMER } from '../shopify/queries/customer.queries';
import {
  CUSTOMER_UPDATE,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
} from '../shopify/mutations/customer.mutations';
import { MOCK_CUSTOMER } from '../shopify/mockData';
import IS_MOCK_MODE from '../config/mockMode';

export const useCustomer = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  // Mock Mode
  if (IS_MOCK_MODE) {
    const MOCK_CUSTOMER_KEY = '@kalendos_mock_customer';

    const [customer, setCustomer] = useState(MOCK_CUSTOMER);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [creatingAddress, setCreatingAddress] = useState(false);
    const [updatingAddress, setUpdatingAddress] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState(false);
    const [settingDefault, setSettingDefault] = useState(false);

    // Load customer from storage
    useEffect(() => {
      const loadCustomer = async () => {
        try {
          const stored = await AsyncStorage.getItem(MOCK_CUSTOMER_KEY);
          if (stored) {
            setCustomer(JSON.parse(stored));
          }
        } catch (error) {
          console.error('Error loading mock customer:', error);
        } finally {
          setLoading(false);
        }
      };
      loadCustomer();
    }, []);

    // Save customer to storage
    const saveCustomer = async (data: any) => {
      console.log('💾 saveCustomer çağrıldı');
      try {
        const jsonData = JSON.stringify(data);
        console.log('📝 AsyncStorage\'a yazılıyor...');
        await AsyncStorage.setItem(MOCK_CUSTOMER_KEY, jsonData);
        console.log('✅ AsyncStorage yazma başarılı');
        setCustomer(data);
        console.log('✅ State güncellendi');
      } catch (error) {
        console.error('❌ saveCustomer hatası:', error);
        throw error;
      }
    };

    const addresses = customer?.addresses?.edges?.map((edge: any) => edge.node) || [];
    const defaultAddress = customer?.defaultAddress || null;

    const updateCustomer = async (data: any) => {
      console.log('🔧 useCustomer.updateCustomer çağrıldı, data:', data);
      setUpdating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const updatedCustomer = { ...customer, ...data };
        console.log('📦 Güncellenmiş müşteri:', updatedCustomer);
        await saveCustomer(updatedCustomer);
        console.log('✅ saveCustomer tamamlandı');
        return updatedCustomer;
      } catch (error) {
        console.error('❌ updateCustomer hatası:', error);
        throw error;
      } finally {
        setUpdating(false);
      }
    };

    const createAddress = async (address: any) => {
      console.log('🔧 useCustomer.createAddress çağrıldı, adres:', address);
      setCreatingAddress(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newAddress = {
          id: `gid://shopify/MailingAddress/${Date.now()}`,
          ...address,
        };
        console.log('📦 Yeni adres oluşturuldu:', newAddress);
        const updatedCustomer = {
          ...customer,
          addresses: {
            edges: [...(customer.addresses?.edges || []), { node: newAddress }],
          },
        };
        console.log('📦 Güncellenmiş müşteri:', updatedCustomer);
        await saveCustomer(updatedCustomer);
        console.log('✅ saveCustomer tamamlandı');
        return newAddress;
      } catch (error) {
        console.error('❌ createAddress hatası:', error);
        throw error;
      } finally {
        setCreatingAddress(false);
      }
    };

    const updateAddress = async (id: string, address: any) => {
      setUpdatingAddress(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const updatedAddresses = customer.addresses?.edges.map((edge: any) =>
          edge.node.id === id ? { node: { ...edge.node, ...address } } : edge
        );
        const updatedCustomer = { ...customer, addresses: { edges: updatedAddresses } };
        await saveCustomer(updatedCustomer);
        return address;
      } finally {
        setUpdatingAddress(false);
      }
    };

    const deleteAddress = async (id: string) => {
      setDeletingAddress(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const updatedAddresses = customer.addresses?.edges.filter(
          (edge: any) => edge.node.id !== id
        );
        const updatedCustomer = { ...customer, addresses: { edges: updatedAddresses } };
        await saveCustomer(updatedCustomer);
        return id;
      } finally {
        setDeletingAddress(false);
      }
    };

    const setDefaultAddress = async (id: string) => {
      setSettingDefault(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const address = customer.addresses?.edges.find(
          (edge: any) => edge.node.id === id
        )?.node;
        if (address) {
          const updatedCustomer = { ...customer, defaultAddress: address };
          await saveCustomer(updatedCustomer);
        }
        return customer;
      } finally {
        setSettingDefault(false);
      }
    };

    return {
      customer,
      addresses,
      defaultAddress,
      loading,
      error: null,
      updating,
      creatingAddress,
      updatingAddress,
      deletingAddress,
      settingDefault,
      updateCustomer,
      createAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      refetch: () => Promise.resolve(),
    };
  }

  // Real Mode - Query customer data
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER, {
    variables: { customerAccessToken: accessToken },
    skip: !accessToken,
    fetchPolicy: 'cache-and-network',
  });

  // Update customer mutation
  const [updateCustomerMutation, { loading: updating }] = useMutation(CUSTOMER_UPDATE);

  // Address mutations
  const [createAddressMutation, { loading: creatingAddress }] =
    useMutation(CUSTOMER_ADDRESS_CREATE);
  const [updateAddressMutation, { loading: updatingAddress }] =
    useMutation(CUSTOMER_ADDRESS_UPDATE);
  const [deleteAddressMutation, { loading: deletingAddress }] =
    useMutation(CUSTOMER_ADDRESS_DELETE);
  const [setDefaultAddressMutation, { loading: settingDefault }] = useMutation(
    CUSTOMER_DEFAULT_ADDRESS_UPDATE
  );

  const customer = data?.customer || null;
  const addresses = customer?.addresses?.edges?.map((edge: any) => edge.node) || [];
  const defaultAddress = customer?.defaultAddress || null;

  const updateCustomer = async (customerData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    acceptsMarketing?: boolean;
  }) => {
    if (!accessToken) throw new Error('No access token');

    try {
      const { data } = await updateCustomerMutation({
        variables: {
          customerAccessToken: accessToken,
          customer: customerData,
        },
      });

      if (data?.customerUpdate?.customerUserErrors?.length > 0) {
        throw new Error(data.customerUpdate.customerUserErrors[0].message);
      }

      await refetch();
      return data?.customerUpdate?.customer;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const createAddress = async (address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone?: string;
  }) => {
    if (!accessToken) throw new Error('No access token');

    try {
      const { data } = await createAddressMutation({
        variables: {
          customerAccessToken: accessToken,
          address,
        },
      });

      if (data?.customerAddressCreate?.customerUserErrors?.length > 0) {
        throw new Error(data.customerAddressCreate.customerUserErrors[0].message);
      }

      await refetch();
      return data?.customerAddressCreate?.customerAddress;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  };

  const updateAddress = async (
    addressId: string,
    address: {
      firstName?: string;
      lastName?: string;
      address1?: string;
      address2?: string;
      city?: string;
      province?: string;
      country?: string;
      zip?: string;
      phone?: string;
    }
  ) => {
    if (!accessToken) throw new Error('No access token');

    try {
      const { data } = await updateAddressMutation({
        variables: {
          customerAccessToken: accessToken,
          id: addressId,
          address,
        },
      });

      if (data?.customerAddressUpdate?.customerUserErrors?.length > 0) {
        throw new Error(data.customerAddressUpdate.customerUserErrors[0].message);
      }

      await refetch();
      return data?.customerAddressUpdate?.customerAddress;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!accessToken) throw new Error('No access token');

    try {
      const { data } = await deleteAddressMutation({
        variables: {
          customerAccessToken: accessToken,
          id: addressId,
        },
      });

      if (data?.customerAddressDelete?.customerUserErrors?.length > 0) {
        throw new Error(data.customerAddressDelete.customerUserErrors[0].message);
      }

      await refetch();
      return data?.customerAddressDelete?.deletedCustomerAddressId;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!accessToken) throw new Error('No access token');

    try {
      const { data } = await setDefaultAddressMutation({
        variables: {
          customerAccessToken: accessToken,
          addressId,
        },
      });

      if (data?.customerDefaultAddressUpdate?.customerUserErrors?.length > 0) {
        throw new Error(data.customerDefaultAddressUpdate.customerUserErrors[0].message);
      }

      await refetch();
      return data?.customerDefaultAddressUpdate?.customer;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  };

  return {
    customer,
    addresses,
    defaultAddress,
    loading,
    error,
    updating,
    creatingAddress,
    updatingAddress,
    deletingAddress,
    settingDefault,
    updateCustomer,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    refetch,
  };
};
