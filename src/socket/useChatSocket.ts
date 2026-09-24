import { useEffect } from 'react'
import { useChat } from "@/hooks/useChat";
import type { Socket } from 'socket.io-client'


export const useChatSocket = (socket: Socket | undefined) => {
  const { addMessage } = useChat();

  useEffect(() => {
    if (!socket) return
    socket.on("chat-message", (msg) => {
      addMessage(msg);
    });
    return () => { socket.off("chat-message"); }
  }, [addMessage, socket]);

}
