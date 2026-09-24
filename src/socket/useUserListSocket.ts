import { useEffect } from 'react'
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import type { ConnectedUser } from '@/types/user'
import type { Socket } from 'socket.io-client'

export function useUserListSocket(socket: Socket | undefined) {
  const { setFriendsOnline } = useConnectedUsers();

  interface FriendFolder {
    name: string,
    users: ConnectedUser[]
  }
  type FriendFolders = FriendFolder[]

  useEffect(() => {
    if (!socket) return;
    socket.on("user-list", (msg: ConnectedUser[]) => {

      const friendFolders: FriendFolders  = [
        {
          name: "general",
          users: msg,
        },
      ];

      setFriendsOnline(friendFolders);
    });
    return () => { socket.off("user-list"); }
  }, [setFriendsOnline]);

  return
}
