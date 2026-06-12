import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

export const checkSymptoms = createAsyncThunk(
    'ai/checkSymptoms',
    async (symptoms, { rejectWithValue }) => {
        try {
            const response = await api.post('ai/symptom-checker/', { symptoms });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Symptom check failed');
        }
    }
);

export const sendChatMessage = createAsyncThunk(
    'ai/sendChatMessage',
    async ({ message, history }, { rejectWithValue }) => {
        try {
            const response = await api.post('ai/chat/', { message, history });
            return { message, reply: response.data.reply };
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Chat failed');
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState: {
        symptomResults: null,
        chatHistory: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSymptoms: (state) => {
            state.symptomResults = null;
        },
        clearChat: (state) => {
            state.chatHistory = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Symptom Checker
            .addCase(checkSymptoms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkSymptoms.fulfilled, (state, action) => {
                state.loading = false;
                state.symptomResults = action.payload;
            })
            .addCase(checkSymptoms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Chatbot
            .addCase(sendChatMessage.pending, (state, action) => {
                // Optimistically add user message
                state.chatHistory.push({ role: 'user', content: action.meta.arg.message });
                state.loading = true;
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.chatHistory.push({ role: 'assistant', content: action.payload.reply });
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.chatHistory.push({ role: 'assistant', content: 'Oops! Something went wrong on the server. Please try again.' });
            });
    },
});

export const { clearSymptoms, clearChat } = aiSlice.actions;
export default aiSlice.reducer;
