import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import testReducer from './testSlice';
import aiReducer from './aiSlice';
import packageReducer from './packageSlice';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tests: testReducer,
        ai: aiReducer,
        packages: packageReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
    },
});

export default store;

