import { useEffect } from 'react'
import { useConnectedUsers } from "@/hooks/useConnectedUsers";

export function useUserListSocket(socket, user) {
  const { setFriendsOnline } = useConnectedUsers();


  useEffect(() => {
    if (!socket.current) return;
    socket.current?.on("user-list", (msg) => {
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
    return () => socket.current?.off("user-list");
  }, [setFriendsOnline, user?.alias]);

  return
}
