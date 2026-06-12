import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const fetchTests = createAsyncThunk(
    'tests/fetchTests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('tests/');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch tests');
        }
    }
);

const testSlice = createSlice({
    name: 'tests',
    initialState: {
        tests: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTests.fulfilled, (state, action) => {
                state.loading = false;
                state.tests = action.payload;
            })
            .addCase(fetchTests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default testSlice.reducer;
