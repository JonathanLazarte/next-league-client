"use client"

import { useState, useEffect, CSSProperties, useRef } from "react";
import { FaUserPlus } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { VscTriangleRight } from "react-icons/vsc";
import Friend from './Friend'
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import { useChat } from "@/hooks/useChat";
import type { ConnectedUser } from "@/redux/slices/connectedUsersSlice"
import type { User } from '@/utils/types'
import useHoverIntent from "@/hooks/useHoverIntent";
import UserTooltip from "@/components/tooltips/UserTooltip/UserTooltip";

interface FriendsGroupProps {
  group: Record<string, any>,
  groupStyle: Record<string, any> | undefined | CSSProperties ,
}

export const FriendsGroup = ({ group, groupStyle }: FriendsGroupProps) => {
  const [ hoveredUser, setHoveredUser ] = useState<ConnectedUser | null>(null);
  const { start, cancel } = useHoverIntent({ initialDelay: 400 });
  const tooltipPosRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const [ toolTipPos, setToolTipPos ] = useState({ x: 0, y: 0 });

  const onHoverStart = (hovereduser: ConnectedUser) => {
    start({
      cb: () => {
        // Setear coords y hover juntos evita el "salto" del tooltip en equipos lentos.
        setToolTipPos({
          x: tooltipPosRef.current.x,
          y: tooltipPosRef.current.y,
        });
        setHoveredUser(hovereduser);
      },
      isTooltipOpened: false
    });
  };
  const onHoverEnd = () => {
    setHoveredUser(null);
    cancel();
  };

  return <ul className="general-user-list">
    <div style={groupStyle}>
      {group?.users?.map((u: ConnectedUser, index: number) => (
        <Friend
          user={u}
          tooltipPosRef={tooltipPosRef}
          onHoverStart={() => onHoverStart(u)}
          onHoverEnd={onHoverEnd}
          key={index}
        />
      ))}
    </div>
    {hoveredUser && <UserTooltip hoveredUser={hoveredUser} tooltipPosRef={tooltipPosRef} tooltipPos={toolTipPos} />}
  </ul>
}


export default function SocialPanel() {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  //const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isFolderOpen, setIsFolderOpen] = useState<boolean>(true);
  const iconStyle = isFolderOpen ? { transform: "rotate(90deg)" } : undefined;
  const groupStyle = !isFolderOpen ? { display: "none" } : undefined;
  const { friendsOnline } = useConnectedUsers();
  const {
    updateChatUser
  } = useChat();

  // Update chat users when friends list changes
  useEffect(() => {
    if (friendsOnline) {
      friendsOnline.forEach((folder) => {
        folder.users.forEach((u: ConnectedUser) => {
          updateChatUser({
            userId: u.alias,
            alias: u.alias,
            profile_icon: u.profile_icon,
            profile_border: u.profile_border,
            status: u.status,
            unreadCount: 0,
            tag: u.tag,
          });
        });
      });
    }
  }, [friendsOnline, updateChatUser]);


  /*const Menu = () => {
    return <div
      className="custom-menu"
      style={{
        position: "fixed",
        left: menuPosition.x,
        top: menuPosition.y,
      }}
    >
      <h5
        className={selectedChat == user.userName ? "blocked" : null}
        onClick={() => {
          setShowMenu(false);
          selectedChat != user.userName && handleEmitBattleRequest();
        }}
      >
        Invitar a una partida
      </h5>
      <h5 onClick={() => setShowMenu(false)}>Ver perfil</h5>
    </div>
  }*/


  return (
    <>
      <div onClick={() => setShowMenu(false)} className="online-users">
        {showMenu && (null/*<Menu></Menu>*/)}
        <div className="social-menu">
          SOCIAL
          <div className="social-icons">
            <FaUserPlus className="social-icon" />
            <FaFolderPlus className="social-icon" />
            <GiHamburgerMenu className="social-icon" />
            <FaSearch className="social-icon" />
          </div>
        </div>
        <div
          className="user-folder-name"
          onClick={() => setIsFolderOpen((p) => !p)}
        >
          <VscTriangleRight style={iconStyle as CSSProperties} className="triangle" />
          {`GENERAL ${friendsOnline[0]?.users.length || 0}/${friendsOnline[0]?.users.length || 0})`}

        </div>
        <FriendsGroup group={friendsOnline[0]} groupStyle={groupStyle}></FriendsGroup>
      </div>
    </>
  );
}
