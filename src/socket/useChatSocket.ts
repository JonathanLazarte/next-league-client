import { useEffect } from 'react'
import { useChat } from "@/hooks/useChat";


export const useChatSocket = (socket) => {
  const { addMessage } = useChat();

  useEffect(() => {
    if (!socket.current) return
    socket.current?.on("chat-message", (msg) => {
      addMessage(msg);
    });
    return () => socket.current?.off("chat-message");
  }, [addMessage]);

}
