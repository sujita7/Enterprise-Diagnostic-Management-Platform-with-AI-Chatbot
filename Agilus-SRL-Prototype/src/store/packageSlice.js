import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const fetchPackages = createAsyncThunk(
    'packages/fetchPackages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('packages/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch packages');
        }
    }
);

const packageSlice = createSlice({
    name: 'packages',
    initialState: {
        packages: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload;
            })
            .addCase(fetchPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default packageSlice.reducer;
