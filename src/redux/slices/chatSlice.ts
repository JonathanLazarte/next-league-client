import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { fetchUser } from '@/redux/slices/userSlice'

export interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: number;
  type: "text" | "system" | "notification";
  isRead: boolean;
  isDelivered?: boolean;
}

export interface ChatUser {
  userId: string;
  userName: string;
  alias: string;
  profile_icon: number;
  status: "online" | "away" | "busy" | "offline";
  lastSeen?: number;
  isTyping?: boolean;
  unreadCount: number;
  tag: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "private" | "group" | "lobby";
  participants: string[];
  lastMessage?: Message;
  isActive: boolean;
  isMinimized: boolean;
  position?: { x: number; y: number };
}

export interface ChatState {
  // Chat rooms management
  activeChats: string[]; // IDs of currently open chats
  minimizedChats: string[]; // IDs of minimized chats
  chatRooms: Record<string, ChatRoom>;

  // Messages management
  messagesByRoom: Record<string, Message[]>;
  messagesByUser: Object;
  messages: Message[];

  // Users management
  chatUsers: Record<string, ChatUser>;

  // UI State
  selectedChat: string | Object | null;
  selectedUser: ChatUser | null;
  isChatVisible: boolean;
  isTyping: Record<string, boolean>; // userId -> isTyping

  // Notifications
  unreadCount: number;
  notifications: Message[];

  // Settings
  soundEnabled: boolean;
  showTimestamps: boolean;
  autoScroll: boolean;
}

const initialState: ChatState = {
  activeChats: [],
  minimizedChats: [],
  chatRooms: {},
  messagesByRoom: {},
  chatUsers: {},
  selectedChat: {},
  selectedUser: null,
  isChatVisible: false,
  isTyping: {},
  unreadCount: 0,
  notifications: [],
  soundEnabled: true,
  showTimestamps: true,
  autoScroll: true,
  messagesByUser: {},
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Chat Room Management
    openChat: (
      state,
      action: PayloadAction<{
        userId: string;
        userName: string;
        profile_icon: number;
      }>,
    ) => {
      const { userId, userName } = action.payload;

      // Create chat room if it doesn't exist
      if (!state.chatRooms[userId]) {
        state.chatRooms[userId] = {
          id: userId,
          name: userName,
          type: "private",
          participants: [userId],
          isActive: true,
          isMinimized: false,
        };
      }

      // Add to active chats if not already there
      if (!state.activeChats.includes(userId)) {
        state.activeChats.push(userId);
      }

      // Remove from minimized if it was there
      state.minimizedChats = state.minimizedChats.filter((id) => id !== userId);

      // Set as selected chat
      state.selectedChat = userId;
      state.isChatVisible = true;

      // Reset unread count for this chat
      if (state.chatUsers[userId]) {
        state.chatUsers[userId].unreadCount = 0;
      }
    },

    closeChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      state.activeChats = state.activeChats.filter((id) => id !== userId);
      state.minimizedChats = state.minimizedChats.filter((id) => id !== userId);

      if (state.selectedChat === userId) {
        state.selectedChat = state.activeChats[0] || null;
        state.isChatVisible = state.activeChats.length > 0;
      }
    },

    minimizeChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.activeChats.includes(userId)) {
        state.activeChats = state.activeChats.filter((id) => id !== userId);
        state.minimizedChats.push(userId);
        state.chatRooms[userId].isMinimized = true;

        if (state.selectedChat === userId) {
          state.selectedChat = state.activeChats[0] || null;
        }
      }
    },

    restoreChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.minimizedChats.includes(userId)) {
        state.minimizedChats = state.minimizedChats.filter(
          (id) => id !== userId,
        );
        state.activeChats.push(userId);
        state.chatRooms[userId].isMinimized = false;
        state.selectedChat = userId;
      }
    },

    selectUser: (state, action: PayloadAction<ChatUser>) => {
      state.selectedUser = action.payload
      state.isChatVisible = true;
    },

    selectChat: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (
        state.activeChats.includes(userId) ||
        state.minimizedChats.includes(userId)
      ) {
        state.selectedChat = userId;
        state.isChatVisible = true;

        // Reset unread count
        if (state.chatUsers[userId]) {
          state.chatUsers[userId].unreadCount = 0;
        }
      }
    },

    // Message Management
    addMessage: (state, action: PayloadAction<Message>) => {
      const newMessages = [...state.messages];
      newMessages.push(action.payload);
      state.messages = newMessages;
    },

    // Message Management
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    markMessageAsRead: (
      state,
      action: PayloadAction<{ roomId: string; messageId: string }>,
    ) => {
      const { roomId, messageId } = action.payload;
      const message = state.messagesByRoom[roomId]?.find(
        (m) => m.id === messageId,
      );
      if (message) {
        message.isRead = true;
      }
    },

    markAllAsRead: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      if (state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId].forEach((message) => {
          message.isRead = true;
        });
      }

      if (state.chatUsers[roomId]) {
        state.chatUsers[roomId].unreadCount = 0;
      }
    },

    // User Management
    updateChatUser: (state, action: PayloadAction<ChatUser>) => {
      const user = action.payload;
      state.chatUsers[user.userId] = user;
    },

    updateUserStatus: (
      state,
      action: PayloadAction<{ userId: string; status: ChatUser["status"] }>,
    ) => {
      const { userId, status } = action.payload;
      if (state.chatUsers[userId]) {
        state.chatUsers[userId].status = status;
        if (status === "offline") {
          state.chatUsers[userId].lastSeen = Date.now();
        }
      }
    },

    // Typing Indicators
    setTyping: (
      state,
      action: PayloadAction<{ userId: string; isTyping: boolean }>,
    ) => {
      const { userId, isTyping } = action.payload;
      state.isTyping[userId] = isTyping;

      if (state.chatUsers[userId]) {
        state.chatUsers[userId].isTyping = isTyping;
      }
    },

    // UI Controls
    toggleChatVisibility: (state) => {
      state.isChatVisible = !state.isChatVisible;
    },

    setChatPosition: (
      state,
      action: PayloadAction<{
        chatId: string;
        position: { x: number; y: number };
      }>,
    ) => {
      const { chatId, position } = action.payload;
      if (state.chatRooms[chatId]) {
        state.chatRooms[chatId].position = position;
      }
    },

    // Settings
    updateChatSettings: (
      state,
      action: PayloadAction<
        Partial<
          Pick<ChatState, "soundEnabled" | "showTimestamps" | "autoScroll">
        >
      >,
    ) => {
      Object.assign(state, action.payload);
    },

    // Notifications
    clearNotification: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      state.notifications = state.notifications.filter(
        (n) => n.id !== messageId,
      );
    },

    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },

    // Cleanup
    clearChatHistory: (state, action: PayloadAction<string>) => {
      const roomId = action.payload;
      if (state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder.
      addCase(fetchUser.fulfilled, (state, action: PayloadAction<{ userData: { messages: Message[]}} >) => {
        const { userData } = action.payload
        state.messages = userData.messages
      })
  }
});

export const isChatVisible = (state) => state.chat.isChatVisible;

export const selectChatData = createSelector(
  [isChatVisible],
  (isChatVisible) => ({ isChatVisible }),
);

export const {
  openChat,
  closeChat,
  minimizeChat,
  restoreChat,
  selectChat,
  selectUser,
  setMessages,
  addMessage,
  markMessageAsRead,
  markAllAsRead,
  updateChatUser,
  updateUserStatus,
  setTyping,
  toggleChatVisibility,
  setChatPosition,
  updateChatSettings,
  clearNotification,
  clearAllNotifications,
  clearChatHistory,
} = chatSlice.actions;

export default chatSlice.reducer;
