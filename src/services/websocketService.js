import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.store = null;
  }

  // Set store reference after initialization
  setStore(store) {
    this.store = store;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://147.93.84.104';
    
    this.socket = io(backendUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
    });

    // Chat events
    this.socket.on('chat:new_message', (data) => {
      console.log('New message received:', data);
      if (!this.store) return;
      
      const { conversationId, message } = data;
      
      // Import actions dynamically to avoid circular dependencies
      import('../features/messages/messageSlice').then(({ addMessage, updateLastMessage, incrementUnreadCount }) => {
        // Add message to store
        this.store.dispatch(addMessage({ conversationId, message }));
        
        // Update conversation last message
        this.store.dispatch(updateLastMessage({
          conversationId,
          lastMessage: {
            messageId: message.messageId,
            senderId: message.senderId,
            content: message.content?.text || '[Attachment]',
            sentAt: message.createdAt,
          }
        }));

        // Increment unread count for other participants
        const currentUser = this.store.getState().auth.user;
        if (message.senderId !== currentUser?.id) {
          this.store.dispatch(incrementUnreadCount({
            conversationId,
            userId: currentUser?.id
          }));
        }
      });
    });

    this.socket.on('chat:message_delivered', (data) => {
      if (!this.store) return;
      
      const { conversationId, messageIds } = data;
      import('../features/messages/messageSlice').then(({ updateMessage }) => {
        messageIds.forEach(messageId => {
          this.store.dispatch(updateMessage({
            conversationId,
            messageId,
            updates: { status: 'delivered' }
          }));
        });
      });
    });

    this.socket.on('chat:message_read', (data) => {
      if (!this.store) return;
      
      const { conversationId, messageIds } = data;
      import('../features/messages/messageSlice').then(({ updateMessage }) => {
        messageIds.forEach(messageId => {
          this.store.dispatch(updateMessage({
            conversationId,
            messageId,
            updates: { status: 'read' }
          }));
        });
      });
    });

    this.socket.on('chat:message_edited', (data) => {
      if (!this.store) return;
      
      const { conversationId, message } = data;
      import('../features/messages/messageSlice').then(({ updateMessage }) => {
        this.store.dispatch(updateMessage({
          conversationId,
          messageId: message.messageId,
          updates: message
        }));
      });
    });

    this.socket.on('chat:message_deleted', (data) => {
      if (!this.store) return;
      
      const { conversationId, messageId } = data;
      import('../features/messages/messageSlice').then(({ removeMessage }) => {
        this.store.dispatch(removeMessage({ conversationId, messageId }));
      });
    });

    this.socket.on('chat:reaction_added', (data) => {
      if (!this.store) return;
      
      const { conversationId, messageId, reaction } = data;
      import('../features/messages/messageSlice').then(({ updateMessage }) => {
        this.store.dispatch(updateMessage({
          conversationId,
          messageId,
          updates: {
            reactions: (prevReactions = []) => [...prevReactions, reaction]
          }
        }));
      });
    });

    // User events
    this.socket.on('user:typing', (data) => {
      if (!this.store) return;
      
      const { conversationId, userId } = data;
      import('../features/messages/messageSlice').then(({ setTypingUser }) => {
        this.store.dispatch(setTypingUser({
          conversationId,
          userId,
          isTyping: true
        }));
      });
    });

    this.socket.on('user:stopped_typing', (data) => {
      if (!this.store) return;
      
      const { conversationId, userId } = data;
      import('../features/messages/messageSlice').then(({ setTypingUser }) => {
        this.store.dispatch(setTypingUser({
          conversationId,
          userId,
          isTyping: false
        }));
      });
    });

    // Conversation events
    this.socket.on('chat:conversation_created', (data) => {
      if (!this.store) return;
      
      import('../features/conversations/conversationSlice').then(({ addConversation }) => {
        this.store.dispatch(addConversation(data.conversation));
      });
    });

    this.socket.on('chat:conversation_updated', (data) => {
      if (!this.store) return;
      
      import('../features/conversations/conversationSlice').then(({ addConversation }) => {
        this.store.dispatch(addConversation(data.conversation));
      });
    });

    // Error handling
    this.socket.on('chat:error', (error) => {
      console.error('Chat error:', error);
    });
  }

  // Send message
  sendMessage(conversationId, content, attachments = [], receiverId) {
    if (!this.socket || !this.isConnected) {
      throw new Error('WebSocket not connected');
    }

    this.socket.emit('send_message', {
      conversationId,
      content,
      attachments,
      receiverId
    });
  }

  // Join conversation room
  joinConversation(conversationId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('join_conversations', [conversationId]);
  }

  // Leave conversation room
  leaveConversation(conversationId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('leave_conversation', { conversationId });
  }

  // Typing indicators
  startTyping(conversationId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('typing', conversationId);
  }

  stopTyping(conversationId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('stop_typing', conversationId);
  }

  // Mark messages as read
  markAsRead(conversationId, messageIds) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('mark_read', conversationId, messageIds[0]);
  }

  // Mark messages as delivered
  markAsDelivered(conversationId, messageIds) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('chat:message_delivered', { conversationId, messageIds });
  }

  // Add reaction to message
  addReaction(conversationId, messageId, emoji) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('chat:message_reaction', { conversationId, messageId, emoji });
  }

  // Edit message
  editMessage(conversationId, messageId, newContent) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('chat:edit_message', { conversationId, messageId, newContent });
  }

  // Delete message
  deleteMessage(conversationId, messageId) {
    if (!this.socket || !this.isConnected) return;
    
    this.socket.emit('chat:delete_message', { conversationId, messageId });
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService; 