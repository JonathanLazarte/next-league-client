import { useEffect } from 'react'
import { useChat } from "@/hooks/useChat";
import type { Socket } from 'socket.io-client'
import type { Message } from '@/types/chat';


export const useChatSocket = (socket: Socket | undefined) => {
  const { addMessage } = useChat();

  useEffect(() => {
    if (!socket) return
    socket.on("chat-message", (msg: Message) => {
      addMessage(msg);
    });
    return () => { socket.off("chat-message"); }
  }, [addMessage, socket]);

}
