import { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_HANDLE,
  GET_COLLECTIONS,
  GET_COLLECTION_BY_HANDLE,
  SEARCH_PRODUCTS,
} from '../shopify/queries/product.queries';
import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from '../shopify/mockData';
import IS_MOCK_MODE from '../config/mockMode';

/**
 * Hook to fetch all products with pagination
 */
export const useProducts = (
  first: number = 20,
  query?: string
) => {
  // Mock Mode
  if (IS_MOCK_MODE) {
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simulate loading delay
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    }, []);

    const filteredProducts = query
      ? products.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase())
        )
      : products;

    return {
      products: filteredProducts.slice(0, first),
      loading,
      error: null,
      hasMore: false,
      loadMore: () => {},
      refetch: () => Promise.resolve(),
    };
  }

  // Real Mode
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
  // Mock Mode
  if (IS_MOCK_MODE) {
    const [product, setProduct] = useState(
      MOCK_PRODUCTS.find((p) => p.handle === handle) || null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timeout);
    }, [handle]);

    return {
      product,
      loading,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }

  // Real Mode
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
  // Mock Mode
  if (IS_MOCK_MODE) {
    const [collections, setCollections] = useState(MOCK_COLLECTIONS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timeout = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timeout);
    }, []);

    return {
      collections: collections.slice(0, first),
      loading,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }

  // Real Mode
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
 * Normalize Turkish characters for search
 */
const normalizeTurkish = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c');
};

/**
 * Hook to search products
 */
export const useSearchProducts = () => {
  // Mock Mode
  if (IS_MOCK_MODE) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const search = (query: string, first: number = 20) => {
      setLoading(true);

      // Simulate loading delay
      setTimeout(() => {
        const normalizedQuery = normalizeTurkish(query);
        const filtered = MOCK_PRODUCTS.filter((p) => {
          const normalizedTitle = normalizeTurkish(p.title);
          const normalizedDesc = normalizeTurkish(p.description);
          return (
            normalizedTitle.includes(normalizedQuery) ||
            normalizedDesc.includes(normalizedQuery)
          );
        });

        setProducts(filtered.slice(0, first));
        setLoading(false);
      }, 300);
    };

    return {
      search,
      products,
      loading,
      error: null,
    };
  }

  // Real Mode
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
