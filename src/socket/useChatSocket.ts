import { useEffect } from 'react'
import { useChat } from "@/hooks/useChat";
import type { SocketRef } from '@/utils/types'


export const useChatSocket = (socket: SocketRef) => {
  const { addMessage } = useChat();

  useEffect(() => {
    const socketCurrent = socket?.current
    if (!socketCurrent) return
    socket.current?.on("chat-message", (msg) => {
      addMessage(msg);
    });
    return () => { socketCurrent.off("chat-message"); }
  }, [addMessage, socket]);

}
