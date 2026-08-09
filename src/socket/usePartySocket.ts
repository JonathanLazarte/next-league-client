import { useEffect } from 'react'

export const usePartySocket = (socket, setPartyRequest) => {
  useEffect(() => {
    socket.current?.on("battle-mailbox", (msg) => {
      const request = [{ roomId: msg.roomId, from: msg.from, to: msg.from }];
      setPartyRequest(request);
      setTimeout(() => {
        setPartyRequest([]);
      }, 7000);
    });
    return () => socket.current?.off("battle-mailbox");
  }, [setPartyRequest]);
}
