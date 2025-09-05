import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchConversations = createAsyncThunk(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  conversations: [],
  selectedConversation: null,
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    
    addConversation: (state, action) => {
      const conversation = action.payload;
      const existingIndex = state.conversations.findIndex(c => c.id === conversation.id);
      if (existingIndex !== -1) {
        state.conversations[existingIndex] = conversation;
      } else {
        state.conversations.unshift(conversation);
      }
    },
    
    updateConversation: (state, action) => {
      const { conversationId, updates } = action.payload;
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          ...updates,
        };
      }
    },
    
    updateLastMessage: (state, action) => {
      const { conversationId, lastMessage } = action.payload;
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex].lastMessage = lastMessage;
        state.conversations[conversationIndex].updatedAt = new Date().toISOString();
      }
    },
    
    incrementUnreadCount: (state, action) => {
      const { conversationId, userId } = action.payload;
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        const participant = state.conversations[conversationIndex].participants?.find(p => p.userId === userId);
        if (participant) {
          participant.unreadCount = (participant.unreadCount || 0) + 1;
        }
      }
    },
    
    clearUnreadCount: (state, action) => {
      const { conversationId, userId } = action.payload;
      const conversationIndex = state.conversations.findIndex(c => c.id === conversationId);
      if (conversationIndex !== -1) {
        const participant = state.conversations[conversationIndex].participants?.find(p => p.userId === userId);
        if (participant) {
          participant.unreadCount = 0;
        }
      }
    },
    
    removeConversation: (state, action) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(c => c.id !== conversationId);
      if (state.selectedConversation?.id === conversationId) {
        state.selectedConversation = null;
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedConversation,
  addConversation,
  updateConversation,
  updateLastMessage,
  incrementUnreadCount,
  clearUnreadCount,
  removeConversation,
  clearError,
} = conversationSlice.actions;

export default conversationSlice.reducer; 