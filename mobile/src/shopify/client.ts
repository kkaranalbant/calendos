import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { SHOPIFY_STOREFRONT_API_URL, SHOPIFY_STOREFRONT_ACCESS_TOKEN } from '@env';

/**
 * Shopify Storefront API Apollo Client
 *
 * This client handles all GraphQL requests to Shopify's Storefront API.
 * Requires:
 * - SHOPIFY_STOREFRONT_API_URL: Your store's Storefront API URL
 * - SHOPIFY_STOREFRONT_ACCESS_TOKEN: Storefront API access token
 */

// Create HTTP link to Shopify Storefront API
const httpLink = createHttpLink({
  uri: SHOPIFY_STOREFRONT_API_URL || 'https://your-store.myshopify.com/api/2024-01/graphql.json',
});

// Authentication link to add Shopify access token to headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      'Content-Type': 'application/json',
    },
  };
});

// Create Apollo Client instance
export const shopifyClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default shopifyClient;
