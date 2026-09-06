"use client";

import { useState, useEffect, useRef, memo, useMemo } from "react";
import { PiMinus } from "react-icons/pi";
import "./Chat.css";
import { useSound } from "@/hooks/useSound";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";
import { RESOURCES_URL } from '@/utils/constants'
import Image from 'next/image'

export default memo(function Chat({ socket }) {
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { alias } = useUser();
  const {
    selectedUser,
    isChatVisible,
    isTyping: typingUsers,
    showTimestamps,
    autoScroll,
    messages,
    addMessage,
    markAllAsRead,
    toggleChatVisibility,
  } = useChat();

  const isUserTyping = selectedUser
    ? typingUsers[selectedUser?.alias] || false
    : false;

  const { play: playClickSound } = useSound("/sfx/menu-click.mp3");
  // Auto-scroll al fondo cuando llegan mensajes nuevos
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Marcar mensajes como leídos al abrir el chat
  useEffect(() => {
    if (selectedUser && isChatVisible) {
      markAllAsRead(selectedUser?.alias);
    }
  }, [selectedUser, isChatVisible, markAllAsRead]);


  // Manejar indicador de escritura
  const handleTyping = (e) => {
    const value = e.target.value;
    setChatInput(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      socket?.current?.emit("typing", { to: selectedUser?.alias, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket?.current?.emit("typing", { to: selectedUser?.alias, isTyping: false });
      }
    }, 1000);
  };
  // Enviar mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedUser?.alias) return;

    const message = {
      id: Date.now().toString(),
      from: alias,
      to: selectedUser?.alias,
      content: chatInput.trim(),
      timestamp: Date.now(),
      type: "text",
      isRead: false,
      isDelivered: false,
    };
    socket?.current?.emit("chat-message", message);

    addMessage(message);
    setChatInput("");

    if (isTyping) {
      setIsTyping(false);
      socket?.current?.emit("typing", { to: selectedUser?.alias, isTyping: false });
    }
  };

  // Cerrar / Minimizar chat
  const handleMinimizeChat = () => {
    playClickSound();
    toggleChatVisibility();
  };

  // Formatear hora
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Color según estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "#00ff00";
      case "away":
        return "#ffff00";
      case "busy":
        return "#ff0000";
      case "offline":
      default:
        return "#808080";
    }
  };
  const filterByUser = (msgs, selectedUser) => {
    if(!msgs) return [];

    return msgs.filter(
      (m) =>
        (m.from === selectedUser && m.to === alias) ||
        (m.to === selectedUser && m.from === alias),
    );
  };

  const filteredMessages = useMemo(() => {
    const result = filterByUser(messages, selectedUser?.alias);
    return result;
  }, [messages, selectedUser]);

  if (!isChatVisible) return null;


  return (
    <div className="chat">
      {/* Header */}
      <div className="chatHead">
        {selectedUser && (
          <div style={{ marginRight: "10px" }} className="chat-user-icon-container">
            <Image
              className="chat-user-icon"
              src={`${RESOURCES_URL}/profileicon/${selectedUser.profile_icon}.png`}
              alt={selectedUser.alias}
              width={30}
              height={30}
            />
            <div
              className="box-status-icon"
              style={{
                backgroundColor: getStatusColor(selectedUser.status),
              }}
            />
          </div>
        )}

        <div className="chat-header-info">
          <span className="chat-username">
            {selectedUser?.alias || selectedUser?.alias || "Seleccione un chat"}
          </span>
          <span className="chat-status">
            {selectedUser?.alias} {selectedUser?.tag}
          </span>
        </div>

        <div className="chat-controls">
          <button
            onClick={handleMinimizeChat}
            className="chat-control-btn"
            title="Minimizar"
          >
            <PiMinus />
          </button>

        </div>
      </div>

      {/* Área de mensajes */}
      <div className="chat-messages">
        {filteredMessages?.map((message) => (
          <div
            key={message.id}
            className={`message ${message.from === alias ? "own-message" : "other-message"}`}
          >
            <div className="message-content">
              <span className="message-text">{message.content}</span>
              {showTimestamps && (
                <span className="message-time">
                  {formatTimestamp(message.timestamp)}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Indicador de escritura */}
        {isUserTyping && (
          <div className="typing-indicator">
            <span>Escribiendo...</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de entrada */}
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          value={chatInput}
          onChange={handleTyping}
          className="input-chat"
          placeholder="Type here..."
          maxLength={500}
          autoFocus
        />
      </form>
    </div>
  );
});
