import { useEffect } from 'react'
import { useChat } from "@/hooks/useChat";


export const useChatSocket = (socket) => {
  const { addMessage } = useChat();

  useEffect(() => {
    const socketRef = socket?.current
    if (!socketRef) return
    socket.current?.on("chat-message", (msg) => {
      addMessage(msg);
    });
    return () => socketRef.off("chat-message");
  }, [addMessage, socket]);

}
