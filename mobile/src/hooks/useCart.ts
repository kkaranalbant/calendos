import { useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setCartId,
  setCartItems,
  setCartTotal,
  addItemToCart as addItemToCartAction,
  updateItemQuantity as updateItemQuantityAction,
  removeItemFromCart as removeItemFromCartAction,
  clearCart as clearCartAction,
} from '../store/slices/cartSlice';
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  GET_CART,
} from '../shopify/mutations/cart.mutations';

const CART_ID_KEY = '@kalendos_cart_id';

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: {
            url: string;
            altText?: string;
          };
        }>;
      };
    };
  };
}

export const useCart = () => {
  const dispatch = useAppDispatch();
  const { cartId, items, total, itemCount } = useAppSelector((state) => state.cart);

  // Mutations
  const [createCart, { loading: creating }] = useMutation(CART_CREATE);
  const [addLines, { loading: adding }] = useMutation(CART_LINES_ADD);
  const [updateLines, { loading: updating }] = useMutation(CART_LINES_UPDATE);
  const [removeLines, { loading: removing }] = useMutation(CART_LINES_REMOVE);

  // Query to fetch cart
  const { data: cartData, loading: fetching, refetch } = useQuery(GET_CART, {
    variables: { id: cartId },
    skip: !cartId,
    fetchPolicy: 'cache-and-network',
  });

  // Load cart ID from storage on mount
  useEffect(() => {
    loadCartId();
  }, []);

  // Update Redux store when cart data changes
  useEffect(() => {
    if (cartData?.cart) {
      const lines = cartData.cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        quantity: edge.node.quantity,
        title: edge.node.merchandise.product.title,
        variantTitle: edge.node.merchandise.title,
        price: parseFloat(edge.node.merchandise.priceV2.amount),
        currency: edge.node.merchandise.priceV2.currencyCode,
        image: edge.node.merchandise.product.images.edges[0]?.node.url || '',
        handle: edge.node.merchandise.product.handle,
      }));

      dispatch(setCartItems(lines));
      dispatch(
        setCartTotal({
          total: parseFloat(cartData.cart.cost.totalAmount.amount),
          subtotal: parseFloat(cartData.cart.cost.subtotalAmount.amount),
          tax: parseFloat(cartData.cart.cost.totalTaxAmount?.amount || '0'),
        })
      );
    }
  }, [cartData, dispatch]);

  const loadCartId = async () => {
    try {
      const storedCartId = await AsyncStorage.getItem(CART_ID_KEY);
      if (storedCartId) {
        dispatch(setCartId(storedCartId));
      }
    } catch (error) {
      console.error('Error loading cart ID:', error);
    }
  };

  const saveCartId = async (id: string) => {
    try {
      await AsyncStorage.setItem(CART_ID_KEY, id);
      dispatch(setCartId(id));
    } catch (error) {
      console.error('Error saving cart ID:', error);
    }
  };

  const createNewCart = async (lines?: Array<{ merchandiseId: string; quantity: number }>) => {
    try {
      const { data } = await createCart({
        variables: {
          input: {
            lines: lines || [],
          },
        },
      });

      if (data?.cartCreate?.cart) {
        await saveCartId(data.cartCreate.cart.id);
        return data.cartCreate.cart;
      }

      if (data?.cartCreate?.userErrors?.length > 0) {
        throw new Error(data.cartCreate.userErrors[0].message);
      }
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  };

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      let currentCartId = cartId;

      // Create cart if doesn't exist
      if (!currentCartId) {
        const cart = await createNewCart([{ merchandiseId: variantId, quantity }]);
        return cart;
      }

      // Add to existing cart
      const { data } = await addLines({
        variables: {
          cartId: currentCartId,
          lines: [{ merchandiseId: variantId, quantity }],
        },
      });

      if (data?.cartLinesAdd?.userErrors?.length > 0) {
        throw new Error(data.cartLinesAdd.userErrors[0].message);
      }

      // Refetch cart to update
      await refetch();

      return data?.cartLinesAdd?.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cartId) return;

    try {
      const { data } = await updateLines({
        variables: {
          cartId,
          lines: [{ id: lineId, quantity }],
        },
      });

      if (data?.cartLinesUpdate?.userErrors?.length > 0) {
        throw new Error(data.cartLinesUpdate.userErrors[0].message);
      }

      await refetch();
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  };

  const removeFromCart = async (lineId: string) => {
    if (!cartId) return;

    try {
      const { data } = await removeLines({
        variables: {
          cartId,
          lineIds: [lineId],
        },
      });

      if (data?.cartLinesRemove?.userErrors?.length > 0) {
        throw new Error(data.cartLinesRemove.userErrors[0].message);
      }

      await refetch();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem(CART_ID_KEY);
      dispatch(clearCartAction());
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getCheckoutUrl = () => {
    return cartData?.cart?.checkoutUrl || null;
  };

  return {
    cartId,
    items,
    total,
    itemCount,
    loading: creating || adding || updating || removing || fetching,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch,
    getCheckoutUrl,
  };
};
