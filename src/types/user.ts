import type { ChatUser } from '@/redux/slices/chatSlice'

export interface ConnectedUser extends ChatUser {
  id: string;
  alias: string;
  tag: string;
  title: string;
  rank: {
    name: string,
    points: number
  };
  profile_icon: number;
  profile_background: string;
  profile_border: string;
  status: "online" | "offline" | "away";
  activity:
    | "idle"
    | "in queue"
    | "ranked_flex"
    | "ranked_solo_duo"
    | "swiftplay"
    | "in_game";
}

export interface Rank {
  name: string;
  level: number;
  points: number;
}

export interface User {
  userName: string;
  id: string;
  alias: string;
  tag: string;
  title: string;
  level: number;
  EXP: number;
  BE: number;
  RP: number;
  rank: Rank;
  profile_icon: string;
  profile_background: string;
  loading: boolean;
  token: string
}

export interface UserCredentials {
  userName: string,
  password: string
}
