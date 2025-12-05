import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useAppSelector } from '../store/hooks';
import { GET_CUSTOMER_ORDERS, GET_ORDER_BY_ID } from '../shopify/queries/customer.queries';
import { MOCK_CUSTOMER } from '../shopify/mockData';
import IS_MOCK_MODE from '../config/mockMode';

export const useOrders = (first: number = 20) => {
  const { accessToken } = useAppSelector((state) => state.auth);

  // Mock Mode
  if (IS_MOCK_MODE) {
    const [orders, setOrders] = useState(
      MOCK_CUSTOMER.orders?.edges?.map((edge: any) => edge.node) || []
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    }, []);

    return {
      orders: orders.slice(0, first),
      loading,
      error: null,
      hasMore: false,
      loadMore: () => {},
      refetch: () => Promise.resolve(),
    };
  }

  // Real Mode
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
  // Mock Mode
  if (IS_MOCK_MODE) {
    const [order, setOrder] = useState(
      MOCK_CUSTOMER.orders?.edges
        ?.map((edge: any) => edge.node)
        .find((o: any) => o.id === orderId) || null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timeout);
    }, [orderId]);

    return {
      order,
      loading,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }

  // Real Mode
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
