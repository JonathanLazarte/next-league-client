import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { fetchUser } from '@/redux/slices/userSlice'
import type { ConnectedUser } from "@/types/user"

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
  alias: string;
  profile_icon: number;
  profile_border: string;
  status: "online" | "offline" | "away";
  lastSeen?: number;
  isTyping?: boolean | undefined;
  unreadCount?: number;
  tag: string;
  id: string;
  title: string;
  rank: {
    name: string,
    points: number
  };
  profile_background?: string;
  activity?:
    | "idle"
    | "in queue"
    | "ranked_flex"
    | "ranked_solo_duo"
    | "swiftplay"
    | "in_game";
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
  messagesByUser: object;
  messages: Message[];

  // Users management
  chatUsers: Record<string, ChatUser>;

  // UI State
  selectedChat: string | object | null;
  selectedUser: ChatUser | null;
  isChatVisible: boolean;
  isTyping: Record<string, boolean>;

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
        id: string;
        alias: string;
        profile_icon: number;
      }>,
    ) => {
      const { id, alias } = action.payload;

      // Create chat room if it doesn't exist
      if (!state.chatRooms[id]) {
        state.chatRooms[id] = {
          id: id,
          name: alias,
          type: "private",
          participants: [id],
          isActive: true,
          isMinimized: false,
        };
      }

      // Add to active chats if not already there
      if (!state.activeChats.includes(id)) {
        state.activeChats.push(id);
      }

      // Remove from minimized if it was there
      state.minimizedChats = state.minimizedChats.filter((id) => id !== id);

      // Set as selected chat
      state.selectedChat = id;
      state.isChatVisible = true;

      // Reset unread count for this chat
      if (state.chatUsers[id]) {
        state.chatUsers[id].unreadCount = 0;
      }
    },

    closeChat: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.activeChats = state.activeChats.filter((userid) => userid !== id);
      state.minimizedChats = state.minimizedChats.filter((userid) => userid !== id);

      if (state.selectedChat === id) {
        state.selectedChat = state.activeChats[0] || null;
        state.isChatVisible = state.activeChats.length > 0;
      }
    },

    minimizeChat: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.activeChats.includes(id)) {
        state.activeChats = state.activeChats.filter((userid) => userid !== id);
        state.minimizedChats.push(id);
        state.chatRooms[id].isMinimized = true;

        if (state.selectedChat === id) {
          state.selectedChat = state.activeChats[0] || null;
        }
      }
    },

    restoreChat: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.minimizedChats.includes(id)) {
        state.minimizedChats = state.minimizedChats.filter(
          (userid) => userid !== id,
        );
        state.activeChats.push(id);
        state.chatRooms[id].isMinimized = false;
        state.selectedChat = id;
      }
    },

    selectUser: (state, action: PayloadAction<ConnectedUser>) => {
      state.selectedUser = action.payload
      state.isChatVisible = true;
    },

    selectChat: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (
        state.activeChats.includes(id) ||
        state.minimizedChats.includes(id)
      ) {
        state.selectedChat = id;
        state.isChatVisible = true;

        // Reset unread count
        if (state.chatUsers[id]) {
          state.chatUsers[id].unreadCount = 0;
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

    markAllAsRead: (state, action: PayloadAction<{ roomId: string}>) => {
      const { roomId } = action.payload;
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
    updateChatUser: (state, action: PayloadAction<ConnectedUser>) => {
      const user = action.payload;
      state.chatUsers[user.id] = user;
    },

    updateUserStatus: (
      state,
      action: PayloadAction<{ id: string; status: ChatUser["status"] }>,
    ) => {
      const { id, status } = action.payload;
      if (state.chatUsers[id]) {
        state.chatUsers[id].status = status;
        if (status === "offline") {
          state.chatUsers[id].lastSeen = Date.now();
        }
      }
    },

    // Typing Indicators
    setTyping: (
      state,
      action: PayloadAction<{ id: string; isTyping: boolean }>,
    ) => {
      const { id, isTyping } = action.payload;
      state.isTyping[id] = isTyping;

      if (state.chatUsers[id]) {
        state.chatUsers[id].isTyping = isTyping;
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
    clearChatHistory: (state, action: PayloadAction<{ roomId: string}>) => {
      const { roomId } = action.payload;
      if (state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder.
      addCase(fetchUser.fulfilled, (state, action: PayloadAction<Record<string, any>>) => {
        const userData = action.payload
        state.messages = userData.messages
      })
  }
});

export const isChatVisible = (state: { chat: ChatState }) => state.chat.isChatVisible;

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
