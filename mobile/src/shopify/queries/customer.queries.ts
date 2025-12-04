import { gql } from '@apollo/client';

/**
 * Query to fetch customer information
 */
export const GET_CUSTOMER = gql`
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      displayName
      phone
      acceptsMarketing
      createdAt
      updatedAt
      defaultAddress {
        id
        address1
        address2
        city
        province
        provinceCode
        country
        countryCodeV2
        zip
        phone
        firstName
        lastName
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            province
            provinceCode
            country
            countryCodeV2
            zip
            phone
            firstName
            lastName
          }
        }
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            name
            processedAt
            financialStatus
            fulfillmentStatus
            totalPriceV2 {
              amount
              currencyCode
            }
            subtotalPriceV2 {
              amount
              currencyCode
            }
            totalShippingPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * Query to fetch customer orders with pagination
 */
export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          cursor
          node {
            id
            orderNumber
            name
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            totalPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
            shippingAddress {
              address1
              city
              province
              country
              zip
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

/**
 * Query to fetch a single order by ID
 */
export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        orderNumber
        name
        email
        phone
        processedAt
        financialStatus
        fulfillmentStatus
        cancelReason
        canceledAt
        statusUrl
        totalPriceV2 {
          amount
          currencyCode
        }
        subtotalPriceV2 {
          amount
          currencyCode
        }
        totalShippingPriceV2 {
          amount
          currencyCode
        }
        totalTaxV2 {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              variant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
                product {
                  handle
                }
              }
            }
          }
        }
        shippingAddress {
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
          phone
        }
      }
    }
  }
`;
