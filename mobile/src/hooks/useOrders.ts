import { useQuery } from '@apollo/client';
import { useAppSelector } from '../store/hooks';
import { GET_CUSTOMER_ORDERS, GET_ORDER_BY_ID } from '../shopify/queries/customer.queries';

export const useOrders = (first: number = 20) => {
  const { accessToken } = useAppSelector((state) => state.auth);

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_CUSTOMER_ORDERS, {
    variables: {
      customerAccessToken: accessToken,
      first,
    },
    skip: !accessToken,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const orders = data?.customer?.orders?.edges?.map((edge: any) => edge.node) || [];
  const pageInfo = data?.customer?.orders?.pageInfo;

  const loadMore = () => {
    if (pageInfo?.hasNextPage && !loading) {
      return fetchMore({
        variables: {
          customerAccessToken: accessToken,
          first,
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            customer: {
              ...fetchMoreResult.customer,
              orders: {
                ...fetchMoreResult.customer.orders,
                edges: [
                  ...prev.customer.orders.edges,
                  ...fetchMoreResult.customer.orders.edges,
                ],
              },
            },
          };
        },
      });
    }
  };

  return {
    orders,
    loading,
    error,
    hasMore: pageInfo?.hasNextPage || false,
    loadMore,
    refetch,
  };
};

export const useOrder = (orderId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: orderId },
    skip: !orderId,
    fetchPolicy: 'cache-and-network',
  });

  const order = data?.node || null;

  return {
    order,
    loading,
    error,
    refetch,
  };
};
