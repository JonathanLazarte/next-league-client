import { Socket } from "socket.io-client"

export type SocketRef = React.RefObject<Socket>
export interface User {
  userId: string;
  userName: string;
  alias: string;
  profile_icon: number;
  status: "online" | "away" | "busy" | "offline";
  lastSeen?: number;
  isTyping?: boolean;
  unreadCount: number;
  tag: string;
  rank: Record<string, any>,
  profile_border: number,
  profile_background: string,
  title: string
}
