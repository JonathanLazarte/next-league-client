import React, { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import { Socket } from "socket.io-client"

interface MessageData {
  from: string,
  to: string,
  message: string
  isTyping?: boolean,
}

interface User {
  userId: string,
  userName: string,
  status: string
}

export function useChatSocket(socketRef: React.RefObject<Socket | null>) {
  const { addMessage, setTyping, updateUserStatus } = useChat()
  const typingTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!socketRef.current) return

    // Handle incoming messages
    const handleChatMessage = (messageData: MessageData) => {
      const message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        from: messageData.from,
        to: messageData.to,
        content: messageData.message,
        timestamp: Date.now(),
        type: 'text',
        isRead: false,
        isDelivered: true
      }

      addMessage(message)
    }

    // Handle typing indicators
    const handleTyping = (data: MessageData) => {
      setTyping({ userId: data.from, isTyping: data.isTyping })

      // Clear existing timeout
      if (typingTimeouts.current[data.from]) {
        clearTimeout(typingTimeouts.current[data.from])
      }

      // Set timeout to stop typing indicator
      if (data.isTyping) {
        typingTimeouts.current[data.from] = setTimeout(() => {
          setTyping({ userId: data.from, isTyping: false })
        }, 3000)
      }
    }

    // Handle user status updates
    const handleUserStatusUpdate = (data: User) => {
      updateUserStatus({
        userId: data.userId,
        status: data.status
      })
    }

    // Handle user online/offline
    const handleUserOnline = (data: User) => {
      updateUserStatus({
        userId: data.userName,
        status: 'online'
      })
    }

    const handleUserOffline = (data: User) => {
      updateUserStatus({
        userId: data.userName,
        status: 'offline'
      })
    }

    // Register event listeners
    socketRef.current.on('chat-message', handleChatMessage)
    socketRef.current.on('typing', handleTyping)
    socketRef.current.on('user-status-update', handleUserStatusUpdate)
    socketRef.current.on('user-online', handleUserOnline)
    socketRef.current.on('user-offline', handleUserOffline)

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.off('chat-message', handleChatMessage)
        socketRef.current.off('typing', handleTyping)
        socketRef.current.off('user-status-update', handleUserStatusUpdate)
        socketRef.current.off('user-online', handleUserOnline)
        socketRef.current.off('user-offline', handleUserOffline)
      }

      // Clear all typing timeouts
      Object.values(typingTimeouts.current).forEach(timeout => {
        clearTimeout(timeout)
      })
      typingTimeouts.current = {}
    }
  }, [ addMessage, setTyping, updateUserStatus ])

  // Function to emit typing indicator
  const emitTyping = (to: string, isTyping: string) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { to, isTyping })
    }
  }

  // Function to emit message
  const emitMessage = (to: string, from: string, message: string) => {
    if (socketRef.current) {
      socketRef.current.emit('chat-message', { to, from, message })
    }
  }

  // Function to emit status update
  const emitStatusUpdate = (status) => {
    if (socketRef.current) {
      socketRef.current.emit('user-status-update', { status })
    }
  }

  return {
    emitTyping,
    emitMessage,
    emitStatusUpdate
  }
}
