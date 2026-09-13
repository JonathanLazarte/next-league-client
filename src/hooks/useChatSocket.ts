import { useEffect, useRef } from 'react'
import { useChat } from '@/hooks/useChat'
import type { Socket } from "socket.io-client"
import type {
  ChatUser,
  Message
} from '@/redux/slices/chatSlice'



export function useChatSocket(socket: Socket | undefined) {
  const { addMessage, setTyping, updateUserStatus } = useChat()
  const typingTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!socket) return

    // Handle incoming messages
    const handleChatMessage = (messageData: Message) => {
      const message: Message = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        from: messageData.from,
        to: messageData.to,
        content: messageData.content,
        timestamp: Date.now(),
        type: 'text',
        isRead: false,
        isDelivered: true
      }

      addMessage(message)
    }

    // Handle typing indicators
    const handleTyping = (user: ChatUser, isTyping: boolean) => {
      setTyping({ userId: user.userId, isTyping  })

      // Clear existing timeout
      if (typingTimeouts.current[user.userId]) {
        clearTimeout(typingTimeouts.current[user.userId])
      }

      // Set timeout to stop typing indicator
      if (user.isTyping) {
        typingTimeouts.current[user.userId] = setTimeout(() => {
          setTyping({ userId: user.userId, isTyping: false })
        }, 3000)
      }
    }

    // Handle user status updates
    const handleUserStatusUpdate = (data: ChatUser) => {
      updateUserStatus({
        userId: data.userId,
        status: data.status
      })
    }

    // Handle user online/offline
    const handleUserOnline = (data: ChatUser) => {
      updateUserStatus({
        userId: data.userName,
        status: 'online'
      })
    }

    const handleUserOffline = (data: ChatUser) => {
      updateUserStatus({
        userId: data.userName,
        status: 'offline'
      })
    }

    // Register event listeners
    socket.on('chat-message', handleChatMessage)
    socket.on('typing', handleTyping)
    socket.on('user-status-update', handleUserStatusUpdate)
    socket.on('user-online', handleUserOnline)
    socket.on('user-offline', handleUserOffline)

    // Cleanup function
    return () => {
      if (socket) {
        socket.off('chat-message', handleChatMessage)
        socket.off('typing', handleTyping)
        socket.off('user-status-update', handleUserStatusUpdate)
        socket.off('user-online', handleUserOnline)
        socket.off('user-offline', handleUserOffline)
      }

      // Clear all typing timeouts
      Object.values(typingTimeouts.current).forEach(timeout => {
        clearTimeout(timeout)
      })
      typingTimeouts.current = {}
    }
  }, [ socket, addMessage, setTyping, updateUserStatus ])

  // Function to emit typing indicator
  const emitTyping = (to: string, isTyping: string) => {
    if (socket) {
      socket.emit('typing', { to, isTyping })
    }
  }

  // Function to emit message
  const emitMessage = (to: string, from: string, message: Message) => {
    if (socket) {
      socket.emit('chat-message', { to, from, message })
    }
  }

  // Function to emit status update
  const emitStatusUpdate = (status: string) => {
    if (socket) {
      socket.emit('user-status-update', { status })
    }
  }

  return {
    emitTyping,
    emitMessage,
    emitStatusUpdate
  }
}
