import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

// Fetch time slots from backend
export const fetchTimeSlots = createAsyncThunk(
    'checkout/fetchTimeSlots',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('time-slots/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch time slots');
        }
    }
);

// Validate coupon code
export const validateCoupon = createAsyncThunk(
    'checkout/validateCoupon',
    async ({ code, orderTotal }, { rejectWithValue }) => {
        try {
            const response = await api.post('coupons/validate/', {
                code,
                order_total: orderTotal,
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { errors: { code: ['Invalid coupon code'] } });
        }
    }
);

// Place order
export const placeOrder = createAsyncThunk(
    'checkout/placeOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await api.post('orders/', orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to place order');
        }
    }
);

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        timeSlots: [],
        timeSlotsLoading: false,
        timeSlotsError: null,

        coupon: null,
        couponLoading: false,
        couponError: null,
        couponDiscount: 0,

        order: null,
        orderLoading: false,
        orderError: null,
        orderPlaced: false,
    },
    reducers: {
        resetCoupon: (state) => {
            state.coupon = null;
            state.couponError = null;
            state.couponDiscount = 0;
        },
        resetCheckout: (state) => {
            state.coupon = null;
            state.couponError = null;
            state.couponDiscount = 0;
            state.order = null;
            state.orderError = null;
            state.orderPlaced = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Time Slots
            .addCase(fetchTimeSlots.pending, (state) => {
                state.timeSlotsLoading = true;
                state.timeSlotsError = null;
            })
            .addCase(fetchTimeSlots.fulfilled, (state, action) => {
                state.timeSlotsLoading = false;
                state.timeSlots = action.payload;
            })
            .addCase(fetchTimeSlots.rejected, (state, action) => {
                state.timeSlotsLoading = false;
                state.timeSlotsError = action.payload;
            })

            // Coupon validation
            .addCase(validateCoupon.pending, (state) => {
                state.couponLoading = true;
                state.couponError = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.couponLoading = false;
                state.coupon = action.payload;
                state.couponDiscount = action.payload.discount_amount || 0;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.couponLoading = false;
                state.couponError = action.payload?.errors?.code?.[0] || action.payload?.errors?.code || 'Invalid coupon code';
                state.coupon = null;
                state.couponDiscount = 0;
            })

            // Place order
            .addCase(placeOrder.pending, (state) => {
                state.orderLoading = true;
                state.orderError = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.orderLoading = false;
                state.order = action.payload;
                state.orderPlaced = true;
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.orderLoading = false;
                state.orderError = action.payload;
            });
    },
});

export const { resetCoupon, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
