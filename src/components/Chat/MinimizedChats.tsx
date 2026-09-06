import { memo } from 'react'
import { useChat } from '@/hooks/useChat'
import { PiXBold } from "react-icons/pi"
import './MinimizedChats.css'

export default memo(function MinimizedChats() {
  const {
    minimizedChats,
    chatUsers,
    restoreChat,
    closeChat,
    selectChat,
  } = useChat()

  const handleRestoreChat = (chatId: string) => {
    restoreChat(chatId)
  }

  const handleCloseChat = (chatId: string) => {
    closeChat(chatId)
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
  }

  if (minimizedChats.length === 0) {
    return null
  }

  return (
    <div className="minimized-chats-container">
      {minimizedChats.map(chatId => {
        const chatUser = chatUsers[chatId]
        if (!chatUser) return null

        return (
          <div
            key={chatId}
            className="minimized-chat"
            onClick={() => handleSelectChat(chatId)}
          >
            <div className="minimized-chat-avatar">
              <img
                src={`https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/profileicon/${chatUser.profile_icon}.png`}
                alt={chatUser.userName}
              />
              {chatUser.unreadCount > 0 && (
                <span className="minimized-unread-badge">
                  {chatUser.unreadCount > 9 ? '9+' : chatUser.unreadCount}
                </span>
              )}
            </div>

            <div className="minimized-chat-info">
              <span className="minimized-chat-name">{chatUser.userName}</span>
              <div className="minimized-chat-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRestoreChat(chatId)
                  }}
                  className="minimized-chat-btn restore-btn"
                  title="Restaurar"
                >
                  ↗
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCloseChat(chatId)
                  }}
                  className="minimized-chat-btn close-btn"
                  title="Cerrar"
                >
                  <PiXBold />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
})
