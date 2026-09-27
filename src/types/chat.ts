export interface Message {
    id: string;
    from: string;
    to: string;
    content: string;
    timestamp: number;
    type: "text" | "system" | "notification";
    isRead: boolean;
    isDelivered?: boolean;
}

export interface ChatUser {
    alias: string;
    profile_icon: number;
    profile_border: string;
    status: "online" | "offline" | "away";
    lastSeen?: number;
    isTyping?: boolean | undefined;
    unreadCount?: number;
    tag: string;
    id: string;
    title: string;
    rank: {
        name: string,
        points: number
    };
    profile_background?: string;
    activity?:
    | "idle"
    | "in queue"
    | "ranked_flex"
    | "ranked_solo_duo"
    | "swiftplay"
    | "in_game";
}

export interface ChatRoom {
    id: string;
    name: string;
    type: "private" | "group" | "lobby";
    participants: string[];
    lastMessage?: Message;
    isActive: boolean;
    isMinimized: boolean;
    position?: { x: number; y: number };
}

