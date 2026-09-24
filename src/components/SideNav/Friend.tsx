"use client"

import { useRef } from 'react'
import Image from "next/image";
import { useSound } from "@/hooks/useSound";
import { useChat } from "@/hooks/useChat";
import { useSmartHover } from "@/hooks/useSmartHover";
import PartyRequest from './PartyRequest'
import { RESOURCES_URL } from '@/utils/constants'
import type { ConnectedUser } from "@/types/user"
import type { ChatUser } from "@/redux/slices/chatSlice"


interface FriendProps {
  user: ConnectedUser,
  battleRequest?: Record<string, any>[],
  handleContextMenu?: () => void,
  tooltipPosRef: React.MutableRefObject<{ x: number, y: number }>,
  onHoverStart: (user: ConnectedUser) => void,
  onHoverEnd: () => void
}

export default (function Friend({
  user,
  battleRequest,
  handleContextMenu,
  tooltipPosRef,
  onHoverStart,
  onHoverEnd,
}: FriendProps) {
  const ref = useRef<HTMLLIElement>(null);
  const { play: playClickSound } = useSound("/sfx/menu-click.mp3");
  const {
    selectUser,
  } = useChat();

  const handleUserClick = (friend: ConnectedUser) => {
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

      tooltipPosRef.current = {
        x: rect.width,
        y: rect.top + rect.height / 2,
      };

      onHoverStart(user);
    },
    onLeave: onHoverEnd,
  });



  if (battleRequest?.find((br: Record<any, unknown>) => br.from === user?.alias)) {
    return PartyRequest(user?.alias);
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
