import { useQuery, useMutation } from '@apollo/client';
import { useAppSelector } from '../store/hooks';
import { GET_CUSTOMER } from '../shopify/queries/customer.queries';
import {
  CUSTOMER_UPDATE,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
} from '../shopify/mutations/customer.mutations';

export const useCustomer = () => {
  const { accessToken } = useAppSelector((state) => state.auth);

  // Query customer data
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
