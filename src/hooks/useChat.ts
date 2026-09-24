import { useAppSelector, useAppDispatch } from '@/hooks/hooks'
import { useCallback } from "react";
import {
  addMessage,
  clearAllNotifications,
  clearChatHistory,
  clearNotification,
  closeChat,
  markAllAsRead,
  markMessageAsRead,
  minimizeChat,
  openChat,
  restoreChat,
  selectChat,
  selectUser,
  setChatPosition,
  setMessages,
  setTyping,
  toggleChatVisibility,
  updateChatSettings,
  updateChatUser,
  updateUserStatus,
} from "@/redux/slices/chatSlice";
import type {
  Message,
  ChatUser,
  ChatState
} from '@/redux/slices/chatSlice'
import type { ConnectedUser } from '@/types/user'

interface OpenChatProps {
  id: string;
  alias: string;
  profile_icon: number;
}
interface MarkMessageAsReadProps {
  roomId: string,
  messageId: string
}
interface UpdateUserStatusProps {
  id: string,
  status: ChatUser["status"]
}
interface SetTypingProps {
  id: string,
  isTyping: boolean
}
interface SetChatPositionProps {
  chatId: string,
  position: { x: number; y: number }
}
type UpdateChatSettingsProps = Partial<
  Pick<ChatState, "soundEnabled" | "showTimestamps" | "autoScroll">
>

export function useChat() {
  const dispatch = useAppDispatch();
  const chat = useAppSelector((state) => state.chat);
  const handleOpenChat = useCallback((payload: OpenChatProps) => dispatch(openChat(payload)), [dispatch]);
  const handleCloseChat = useCallback((payload: string) => dispatch(closeChat(payload)), [dispatch]);
  const handleMinimizeChat = useCallback((payload: string) => dispatch(minimizeChat(payload)), [dispatch]);
  const handleRestoreChat = useCallback((payload: string) => dispatch(restoreChat(payload)), [dispatch]);
  const handleSelectChat = useCallback((payload: string) => dispatch(selectChat(payload)), [dispatch]);
  const handleSelectUser = useCallback((payload: ConnectedUser) => dispatch(selectUser(payload)), [dispatch]);
  const handleAddMessage = useCallback((payload: Message) => dispatch(addMessage(payload)), [dispatch]);
  const handleSetMessages = useCallback((payload: Message[]) => dispatch(setMessages(payload)), [dispatch]);
  const handleMarkMessageAsRead = useCallback((payload: MarkMessageAsReadProps) => dispatch(markMessageAsRead(payload)), [dispatch]);
  const handleMarkAllAsRead = useCallback((payload: { roomId: string }) => dispatch(markAllAsRead(payload)), [dispatch]);
  const handleUpdateChatUser = useCallback((payload: ConnectedUser) => dispatch(updateChatUser(payload)), [dispatch]);
  const handleUpdateUserStatus = useCallback((payload: UpdateUserStatusProps) => dispatch(updateUserStatus(payload)), [dispatch]);
  const handleSetTyping = useCallback((payload: SetTypingProps) => dispatch(setTyping(payload)), [dispatch]);
  const handleToggleChatVisibility = useCallback(() => dispatch(toggleChatVisibility()), [dispatch]);
  const handleSetChatPosition = useCallback((payload: SetChatPositionProps) => dispatch(setChatPosition(payload)), [dispatch]);
  const handleUpdateChatSettings = useCallback((payload: UpdateChatSettingsProps) => dispatch(updateChatSettings(payload)), [dispatch]);
  const handleClearNotification = useCallback((payload: string) => dispatch(clearNotification(payload)), [dispatch]);
  const handleClearAllNotifications = useCallback(() => dispatch(clearAllNotifications()), [dispatch]);
  const handleClearChatHistory = useCallback((payload: { roomId: string }) => dispatch(clearChatHistory(payload)), [dispatch]);

  return {
    ...chat,
    chat,
    openChat: handleOpenChat,
    closeChat: handleCloseChat,
    minimizeChat: handleMinimizeChat,
    restoreChat: handleRestoreChat,
    selectChat: handleSelectChat,
    selectUser: handleSelectUser,
    addMessage: handleAddMessage,
    setMessages: handleSetMessages,
    markMessageAsRead: handleMarkMessageAsRead,
    markAllAsRead: handleMarkAllAsRead,
    updateChatUser: handleUpdateChatUser,
    updateUserStatus: handleUpdateUserStatus,
    setTyping: handleSetTyping,
    toggleChatVisibility: handleToggleChatVisibility,
    setChatPosition: handleSetChatPosition,
    updateChatSettings: handleUpdateChatSettings,
    clearNotification: handleClearNotification,
    clearAllNotifications: handleClearAllNotifications,
    clearChatHistory: handleClearChatHistory,
  };
}
