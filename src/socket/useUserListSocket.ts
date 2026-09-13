import { useEffect } from 'react'
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import type { User } from '@/utils/types'
import type { Socket } from 'socket.io-client'

export function useUserListSocket(socket: Socket, user: User) {
  const { setFriendsOnline } = useConnectedUsers();


  useEffect(() => {
    if (!socket) return;
    socket.on("user-list", (msg: User[]) => {
      //const actualUserIndex = msg.findIndex((u) => u.alias === user.alias);
      //msg.splice(actualUserIndex, 1);
      const ownIndex = msg.findIndex(u => u.alias === user?.alias);
      msg.splice(ownIndex, 1);
      const friendFolders = [
        {
          name: "general",
          users: msg,
        },
      ];

      setFriendsOnline(friendFolders);
    });
    return () => { socket.off("user-list"); }
  }, [setFriendsOnline, user?.alias]);

  return
}
