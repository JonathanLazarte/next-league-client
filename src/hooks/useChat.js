import { useDispatch, useSelector } from "react-redux";
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

export function useChat() {
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat);
  const handleOpenChat = useCallback((payload) => dispatch(openChat(payload)), [dispatch]);
  const handleCloseChat = useCallback((payload) => dispatch(closeChat(payload)), [dispatch]);
  const handleMinimizeChat = useCallback((payload) => dispatch(minimizeChat(payload)), [dispatch]);
  const handleRestoreChat = useCallback((payload) => dispatch(restoreChat(payload)), [dispatch]);
  const handleSelectChat = useCallback((payload) => dispatch(selectChat(payload)), [dispatch]);
  const handleSelectUser = useCallback((payload) => dispatch(selectUser(payload)), [dispatch]);
  const handleAddMessage = useCallback((payload) => dispatch(addMessage(payload)), [dispatch]);
  const handleSetMessages = useCallback((payload) => dispatch(setMessages(payload)), [dispatch]);
  const handleMarkMessageAsRead = useCallback((payload) => dispatch(markMessageAsRead(payload)), [dispatch]);
  const handleMarkAllAsRead = useCallback((payload) => dispatch(markAllAsRead(payload)), [dispatch]);
  const handleUpdateChatUser = useCallback((payload) => dispatch(updateChatUser(payload)), [dispatch]);
  const handleUpdateUserStatus = useCallback((payload) => dispatch(updateUserStatus(payload)), [dispatch]);
  const handleSetTyping = useCallback((payload) => dispatch(setTyping(payload)), [dispatch]);
  const handleToggleChatVisibility = useCallback(() => dispatch(toggleChatVisibility()), [dispatch]);
  const handleSetChatPosition = useCallback((payload) => dispatch(setChatPosition(payload)), [dispatch]);
  const handleUpdateChatSettings = useCallback((payload) => dispatch(updateChatSettings(payload)), [dispatch]);
  const handleClearNotification = useCallback((payload) => dispatch(clearNotification(payload)), [dispatch]);
  const handleClearAllNotifications = useCallback(() => dispatch(clearAllNotifications()), [dispatch]);
  const handleClearChatHistory = useCallback((payload) => dispatch(clearChatHistory(payload)), [dispatch]);

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
