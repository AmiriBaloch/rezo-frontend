import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async ({ conversationId, limit = 50, before }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit);
      if (before) queryParams.append('before', before);
      
      const response = await fetch(`/api/conversations/${conversationId}/messages?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      return { conversationId, messages: data.data, pagination: data.pagination };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ conversationId, content, attachments = [], clientMessageId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          attachments,
          clientMessageId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      return { conversationId, message: data.data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  messages: {}, // conversationId -> messages array
  loading: false,
  error: null,
  typingUsers: {}, // conversationId -> Set of typing user IDs
};

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].unshift(message);
    },
    
    updateMessage: (state, action) => {
      const { conversationId, messageId, updates } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const messageIndex = messages.findIndex(m => m.messageId === messageId);
        if (messageIndex !== -1) {
          messages[messageIndex] = { ...messages[messageIndex], ...updates };
        }
      }
    },
    
    removeMessage: (state, action) => {
      const { conversationId, messageId } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        state.messages[conversationId] = messages.filter(m => m.messageId !== messageId);
      }
    },
    
    setTypingUser: (state, action) => {
      const { conversationId, userId, isTyping } = action.payload;
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = new Set();
      }
      
      if (isTyping) {
        state.typingUsers[conversationId].add(userId);
      } else {
        state.typingUsers[conversationId].delete(userId);
      }
    },
    
    clearMessages: (state, action) => {
      const conversationId = action.payload;
      state.messages[conversationId] = [];
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages, pagination } = action.payload;
        state.messages[conversationId] = messages;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].unshift(message);
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addMessage,
  updateMessage,
  removeMessage,
  setTypingUser,
  clearMessages,
  clearError,
} = messageSlice.actions;

export default messageSlice.reducer; 