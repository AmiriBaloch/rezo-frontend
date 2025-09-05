'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchConversations, 
  setSelectedConversation, 
  clearUnreadCount 
} from '../../../../features/conversations/conversationSlice';
import { 
  fetchMessages, 
  sendMessage as sendMessageAction 
} from '../../../../features/messages/messageSlice';
import websocketService from '../../../../services/websocketService';
import { 
  FiSend, 
  FiPaperclip, 
  FiSmile, 
  FiMoreVertical,
  FiSearch,
  FiUser,
  FiClock,
  FiCheck
} from 'react-icons/fi';

const Messages = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { conversations, selectedConversation, loading: conversationsLoading } = useSelector(state => state.conversations);
  const { messages, loading: messagesLoading, typingUsers } = useSelector(state => state.messages);
  
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && user) {
      websocketService.connect(token);
    }

    return () => {
      websocketService.disconnect();
    };
  }, [user]);

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchConversations());
    }
  }, [dispatch, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // Handle typing indicators
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping && selectedConversation) {
      websocketService.startTyping(selectedConversation.id);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        websocketService.stopTyping(selectedConversation.id);
      }, 3000);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [isTyping, selectedConversation]);

  // Handle conversation selection
  const handleConversationSelect = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    
    // Join conversation room
    websocketService.joinConversation(conversation.id);
    
    // Fetch messages if not already loaded
    if (!messages[conversation.id]) {
      dispatch(fetchMessages({ conversationId: conversation.id }));
    }
    
    // Clear unread count
    dispatch(clearUnreadCount({ 
      conversationId: conversation.id, 
      userId: user?.id 
    }));
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const messageContent = {
      text: newMessage.trim(),
      formattedText: [{
        type: 'text',
        content: newMessage.trim(),
        indices: [0, newMessage.trim().length - 1]
      }]
    };

    try {
      // Send via WebSocket for real-time
      websocketService.sendMessage(
        selectedConversation.id,
        messageContent,
        [],
        selectedConversation.participants?.find(p => p.userId !== user?.id)?.userId
      );

      // Also send via API for persistence
      await dispatch(sendMessageAction({
        conversationId: selectedConversation.id,
        content: messageContent,
        attachments: [],
        clientMessageId: Date.now().toString()
      })).unwrap();

      setNewMessage('');
      setIsTyping(false);
      websocketService.stopTyping(selectedConversation.id);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // TODO: Implement file upload logic
    console.log('Files to upload:', files);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Get conversation display name
  const getConversationName = (conversation) => {
    if (conversation.title) return conversation.title;
    
    const otherParticipant = conversation.participants?.find(p => p.userId !== user?.id);
    return otherParticipant?.name || otherParticipant?.email || 'Unknown User';
  };

  // Get conversation avatar
  const getConversationAvatar = (conversation) => {
    if (conversation.avatar) return conversation.avatar;
    
    const otherParticipant = conversation.participants?.find(p => p.userId !== user?.id);
    return otherParticipant?.avatarUrl || null;
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conversation =>
    getConversationName(conversation).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = selectedConversation ? messages[selectedConversation.id] || [] : [];
  const currentTypingUsers = selectedConversation ? typingUsers[selectedConversation.id] || new Set() : new Set();

  return (
    <div className="flex flex-col gap-[20px] w-full h-[87vh]">
      {/* Header */}
      <h3 className="text-[32px] text-[#25409C] font-semibold">Messages</h3>

      {/* Main Content */}
      <div className="flex h-full bg-white rounded-lg shadow-sm border">
        {/* Conversations List */}
        <div className="w-full md:w-[350px] border-r border-gray-200 flex flex-col">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversationsLoading ? (
              <div className="p-4 text-center text-gray-500">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </div>
            ) : (
              filteredConversations.map(conversation => {
                const unreadCount = conversation.participants?.find(p => p.userId === user?.id)?.unreadCount || 0;
                const isSelected = selectedConversation?.id === conversation.id;
                
                return (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                          {getConversationAvatar(conversation) ? (
                            <img
                              src={getConversationAvatar(conversation)}
                              alt="Avatar"
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </div>
                        )}
                      </div>

                      {/* Conversation Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">
                            {getConversationName(conversation)}
                          </h4>
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.sentAt)}
                            </span>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {getConversationAvatar(selectedConversation) ? (
                      <img
                        src={getConversationAvatar(selectedConversation)}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getConversationName(selectedConversation)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {currentTypingUsers.size > 0 ? 'Typing...' : 'Online'}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <FiMoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="text-center text-gray-500">Loading messages...</div>
                ) : currentMessages.length === 0 ? (
                  <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
                ) : (
                  currentMessages.map(message => {
                    const isOwn = message.senderId === user?.id;
                    
                    return (
                      <div
                        key={message.messageId}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-3 rounded-lg ${
                              isOwn
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content?.text}</p>
                            
                            {/* Message Status */}
                            <div className={`flex items-center justify-end mt-1 space-x-1 ${
                              isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <span className="text-xs">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwn && (
                                <div className="flex items-center">
                                  {message.status === 'sent' && <FiCheck className="w-3 h-3" />}
                                  {message.status === 'delivered' && <FiCheck className="w-3 h-3" />}
                                  {message.status === 'read' && <FiCheck className="w-3 h-3 text-blue-300" />}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Typing Indicator */}
                {currentTypingUsers.size > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {/* Attachment Button */}
                    <button
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className="p-2 hover:bg-gray-100 rounded-lg relative"
                    >
                      <FiPaperclip className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {/* Emoji Button */}
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <FiSmile className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {/* Send Button */}
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;