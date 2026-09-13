import { useEffect } from 'react'
import type { SocketRef } from '@/utils/types'

interface PartyRequest {
  roomId: string;
  from: string;
  to: string;
}

export const usePartySocket = (
  socket: SocketRef,
  setPartyRequest: React.Dispatch<React.SetStateAction<PartyRequest[]>>
) => {
  useEffect(() => {
    socket.current?.on("battle-mailbox", (msg: PartyRequest) => {
      const request = { roomId: msg.roomId, from: msg.from, to: msg.from };
      setPartyRequest(prev => {
        const newRequest = [...prev]
        newRequest.push(request)
        return newRequest
      });
      setTimeout(() => {
        setPartyRequest([]);
      }, 7000);
    });
    return () => { socket.current?.off("battle-mailbox"); }
  }, [setPartyRequest]);
}
