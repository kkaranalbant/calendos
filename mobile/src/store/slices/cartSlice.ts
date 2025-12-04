import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  variantId: string;
  quantity: number;
  title: string;
  variantTitle: string;
  price: number;
  currency: string;
  image: string;
  handle: string;
}

interface CartTotal {
  total: number;
  subtotal: number;
  tax: number;
}

interface CartState {
  cartId: string | null;
  items: CartItem[];
  total: CartTotal;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartId: null,
  items: [],
  total: {
    total: 0,
    subtotal: 0,
    tax: 0,
  },
  itemCount: 0,
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCartId: (state, action: PayloadAction<string>) => {
      state.cartId = action.payload;
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0);
    },
    setCartTotal: (state, action: PayloadAction<CartTotal>) => {
      state.total = action.payload;
    },
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.variantId === action.payload.variantId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    clearCart: (state) => {
      state.cartId = null;
      state.items = [];
      state.total = {
        total: 0,
        subtotal: 0,
        tax: 0,
      };
      state.itemCount = 0;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCartId,
  setCartItems,
  setCartTotal,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
