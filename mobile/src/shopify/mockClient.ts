import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { MockLink } from '@apollo/client/testing';
import { MOCK_PRODUCTS, MOCK_COLLECTIONS } from './mockData';

// Mock GraphQL responses
const mocks = {
  Query: () => ({
    products: () => ({
      edges: MOCK_PRODUCTS.map((product: any) => ({
        node: product,
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }),
    collections: () => ({
      edges: MOCK_COLLECTIONS.map((collection: any) => ({
        node: collection,
      })),
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }),
    productByHandle: (_: any, { handle }: any) => {
      return MOCK_PRODUCTS.find((p: any) => p.handle === handle) || null;
    },
  }),
  Mutation: () => ({
    customerCreate: () => ({
      customer: {
        id: 'gid://shopify/Customer/test123',
        email: 'test@kalendos.com',
        firstName: 'Test',
        lastName: 'User',
      },
      customerUserErrors: [],
    }),
    customerAccessTokenCreate: () => ({
      customerAccessToken: {
        accessToken: 'mock_access_token_123',
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      },
      customerUserErrors: [],
    }),
  }),
};

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Create mock Apollo Client
const mockClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink]),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default mockClient;
