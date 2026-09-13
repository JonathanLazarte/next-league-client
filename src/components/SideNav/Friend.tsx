"use client"

import { useRef } from 'react'
import Image from "next/image";
import { useSound } from "@/hooks/useSound";
import { useChat } from "@/hooks/useChat";
import { useSmartHover } from "@/hooks/useSmartHover";
import { RESOURCES_URL } from '@/utils/constants'

interface Friend {
  userId: string;
  userName: string;
  alias: string;
  profile_icon: number;
  status: "online" | "away" | "busy" | "offline";
  lastSeen?: number;
  isTyping?: boolean;
  unreadCount: number;
  tag: string;
}

export default (function Friend({
  user,
  battleRequest,
  handleContextMenu,
  inviteBox,
  toolTipPosRef,
  onHoverStart,
  onHoverEnd,
}) {
  const ref = useRef(null);
  const { play: playClickSound } = useSound("/sfx/menu-click.mp3");
  const {
    selectUser,
  } = useChat();

  const handleUserClick = (friend: Friend) => {
    // Find the user in friendsOnline to get their profileIcon
    playClickSound();
    // Open chat with the selected user
    selectUser(friend);
  };

  useSmartHover({
    ref,
    onEnter: () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      toolTipPosRef.current = {
        x: rect.width,
        y: rect.top + rect.height / 2,
      };

      onHoverStart(user);
    },
    onLeave: onHoverEnd,
  });

  if (battleRequest?.find((br: Record<any, unknown>) => br.from === user?.alias)) {
    return inviteBox(user?.alias);
  }

  return (
    <li
      ref={ref}
      className="user-box"
      key={user?.alias}
      onClick={() => handleUserClick(user)}
      onContextMenu={handleContextMenu}
    >
      <div className="friendlist-profile-icon">
        <Image
          className="friendlist-profile-icon-image"
          src={`${RESOURCES_URL}/profileicon/${user?.profile_icon}.png`}
          width={150}
          height={150}
          alt={"Friend profile icon"}
        />
        <div className="box-status-icon" />
      </div>

      <div className="user-box-data">
        <span className="friendlist-username">{user?.alias}</span>
        <span className="friendlist-status">Online</span>
        {/*chatUsers[user.alias]?.unreadCount > 0 && (
          <span className="unread-badge">
            {chatUsers[user?.alias]?.unreadCount}
          </span>
        )*/}
      </div>
    </li>
  );
});
