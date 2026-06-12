import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const serialized = localStorage.getItem('agilus_cart');
    if (serialized === null) return [];
    return JSON.parse(serialized);
  } catch (err) {
    return [];
  }
};

const saveCartToStorage = (state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem('agilus_cart', serialized);
  } catch (err) {
    // ignore
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, originalPrice, type } = action.payload;
      // Prevent duplicates
      const exists = state.items.some(
        (item) => item.id === id && item.type === type
      );
      if (!exists) {
        state.items.push({ id, name, price, originalPrice, type });
        saveCartToStorage(state.items);
      }
    },
    removeFromCart: (state, action) => {
      const { id, type } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.id === id && item.type === type)
      );
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
