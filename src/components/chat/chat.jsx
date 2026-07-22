"use client";

import { useState, useEffect, useRef, memo, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addMessage,
  markAllAsRead,
  closeChat,
  /*minimizeChat,*/
  toggleChatVisibility,
} from "@/redux/slices/chatSlice";
import { /*PiXBold,*/ PiMinus } from "react-icons/pi";
import "./chat.css";
import { useSound } from "@/hooks/useSound.js";

export default memo(function Chat({ socket }) {
  const dispatch = useDispatch();
  const RESOURCES_URL =
    "/" ||
    "https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/";
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { alias } = useSelector((state) => state.user);
  const {
    selectedChat,
    isChatVisible,
    /*messagesByRoom,*/
    chatUsers,
    isTyping: typingUsers,
    showTimestamps,
    autoScroll,
    messages,
  } = useSelector((state) => state.chat);
  const selectedChatUser = selectedChat ? chatUsers[selectedChat] : null;
  //const messages = selectedChat ? messagesByRoom[selectedChat] || [] : [];
  const isUserTyping = selectedChat
    ? typingUsers[selectedChat] || false
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
    if (selectedChat && isChatVisible) {
      dispatch(markAllAsRead(selectedChat));
    }
  }, [selectedChat, isChatVisible, dispatch]);

  // Sonido al abrir el chat
  useEffect(() => {
    if (isChatVisible && selectedChat) {
      const sound = new Audio(`${RESOURCES_URL}general/menu-click.mp3`);
      sound.play().catch(() => {}); // Ignorar errores de autoplay
    }
  }, [isChatVisible, selectedChat]);

  // Manejar indicador de escritura
  const handleTyping = (e) => {
    const value = e.target.value;
    setChatInput(value);

    if (value.trim() && !isTyping) {
      setIsTyping(true);
      socket?.current?.emit("typing", { to: selectedChat, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socket?.current?.emit("typing", { to: selectedChat, isTyping: false });
      }
    }, 1000);
  };
  // Enviar mensaje
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChat) return;

    const message = {
      id: Date.now().toString(),
      from: alias,
      to: selectedChat,
      content: chatInput.trim(),
      timestamp: Date.now(),
      type: "text",
      isRead: false,
      isDelivered: false,
    };
    socket?.current?.emit("chat-message", message);

    dispatch(addMessage(message));
    setChatInput("");

    if (isTyping) {
      setIsTyping(false);
      socket?.current?.emit("typing", { to: selectedChat, isTyping: false });
    }
  };

  // Cerrar / Minimizar chat
  /*const handleCloseChat = () =>
    selectedChat && dispatch(closeChat(selectedChat));*/
  const handleMinimizeChat = () => {
    playClickSound();
    dispatch(toggleChatVisibility());
  };

  // Formatear hora
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Color según estado
  const getStatusColor = (status) => {
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
    return msgs.filter(
      (m) =>
        (m.from === selectedUser && m.to === alias) ||
        (m.to === selectedUser && m.from === alias),
    );
  };

  const filteredMessages = useMemo(() => {
    const result = filterByUser(messages, selectedChat);
    return result;
  }, [messages, selectedChat]);

  if (!isChatVisible) return null;

  return (
    <div className="chat">
      {/* Header */}
      <div className="chatHead">
        {selectedChatUser && (
          <div style={{ marginRight: "10px" }} className="icon-border mini">
            <img
              className="user-icon mini"
              src={`${RESOURCES_URL}profileicon/${selectedChatUser.profile_icon}.png`}
              alt={selectedChatUser.alias}
            />
            <div
              className="box-status-icon"
              style={{
                backgroundColor: getStatusColor(selectedChatUser.status),
              }}
            />
          </div>
        )}

        <div className="chat-header-info">
          <span className="chat-username">
            {selectedChatUser?.alias || selectedChat || "Seleccione un chat"}
          </span>
          <span className="chat-status">
            {selectedChatUser?.alias} {selectedChatUser?.tag}
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
          {/*<button
            onClick={handleCloseChat}
            className="chat-control-btn"
            title="Cerrar"
          >
            <PiXBold />
          </button>
          */}
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
