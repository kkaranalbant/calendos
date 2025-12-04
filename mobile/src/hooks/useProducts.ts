import { useQuery, useLazyQuery } from '@apollo/client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_COLLECTIONS,
  GET_COLLECTION_BY_HANDLE,
  SEARCH_PRODUCTS,
} from '../shopify/queries/product.queries';

/**
 * Hook to fetch all products with pagination
 */
export const useProducts = (
  first: number = 20,
  query?: string
) => {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      first,
      query,
    },
    notifyOnNetworkStatusChange: true,
  });

  const products = data?.products?.edges?.map((edge: any) => edge.node) || [];
  const pageInfo = data?.products?.pageInfo;

  const loadMore = () => {
    if (pageInfo?.hasNextPage && !loading) {
      return fetchMore({
        variables: {
          first,
          after: pageInfo.endCursor,
          query,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            products: {
              ...fetchMoreResult.products,
              edges: [
                ...prev.products.edges,
                ...fetchMoreResult.products.edges,
              ],
            },
          };
        },
      });
    }
  };

  return {
    products,
    loading,
    error,
    hasMore: pageInfo?.hasNextPage || false,
    loadMore,
    refetch,
  };
};

/**
 * Hook to fetch a single product by handle
 */
export const useProduct = (handle: string) => {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT_BY_HANDLE, {
    variables: { handle },
    skip: !handle,
  });

  return {
    product: data?.product || null,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch all collections (categories)
 */
export const useCollections = (first: number = 20) => {
  const { data, loading, error, refetch } = useQuery(GET_COLLECTIONS, {
    variables: { first },
  });

  const collections = data?.collections?.edges?.map((edge: any) => edge.node) || [];

  return {
    collections,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch products in a collection
 */
export const useCollectionProducts = (
  handle: string,
  first: number = 20
) => {
  const { data, loading, error, fetchMore, refetch } = useQuery(
    GET_COLLECTION_BY_HANDLE,
    {
      variables: {
        handle,
        first,
      },
      skip: !handle,
      notifyOnNetworkStatusChange: true,
    }
  );

  const collection = data?.collection || null;
  const products = collection?.products?.edges?.map((edge: any) => edge.node) || [];
  const pageInfo = collection?.products?.pageInfo;

  const loadMore = () => {
    if (pageInfo?.hasNextPage && !loading) {
      return fetchMore({
        variables: {
          handle,
          first,
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          return {
            collection: {
              ...fetchMoreResult.collection,
              products: {
                ...fetchMoreResult.collection.products,
                edges: [
                  ...prev.collection.products.edges,
                  ...fetchMoreResult.collection.products.edges,
                ],
              },
            },
          };
        },
      });
    }
  };

  return {
    collection,
    products,
    loading,
    error,
    hasMore: pageInfo?.hasNextPage || false,
    loadMore,
    refetch,
  };
};

/**
 * Hook to search products
 */
export const useSearchProducts = () => {
  const [searchProducts, { data, loading, error }] = useLazyQuery(SEARCH_PRODUCTS);

  const search = (query: string, first: number = 20) => {
    return searchProducts({
      variables: { query, first },
    });
  };

  const products = data?.products?.edges?.map((edge: any) => edge.node) || [];

  return {
    search,
    products,
    loading,
    error,
  };
};
