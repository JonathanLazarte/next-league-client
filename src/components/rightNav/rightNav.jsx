"use client";

import "./rightNav.css";
import { useState, memo, useEffect, useRef } from "react";
import Image from "next/image";


import { FaUserPlus } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa";
import { RiFilePaper2Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdBugReport } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa6";
import { VscTriangleRight } from "react-icons/vsc";
import { IoChatboxSharp } from "react-icons/io5";


import UserTooltip from "@/components/Tooltip/userTooltip/userTooltip.jsx";
import Settings from "@/components/Settings/Settings.jsx";
import ProfileBox from "./ProfileBox.jsx";

import useHoverIntent from "@/hooks/useHoverIntent.js";
import { useSmartHover } from "@/hooks/useSmartHover.js";
import { useSound } from "@/hooks/useSound.js";
import { audioEngine } from "@/engine/audioEngine.js";
import { useUser } from "@/hooks/useUser";
import { useUserInterface } from "@/hooks/useUserInterface";
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";

export const FriendRow = memo(function FriendRow({
  u,
  user,
  RESOURCES_URL,
  battleRequest,
  handleUserClick,
  handleContextMenu,
  inviteBox,
  toolTipPosRef,
  onHoverStart,
  onHoverEnd,
}) {
  const ref = useRef(null);

  useSmartHover({
    ref,
    onEnter: () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      toolTipPosRef.current = {
        x: rect.width,
        y: rect.top + rect.height / 2,
      };

      onHoverStart(u);
    },
    onLeave: onHoverEnd,
  });

  if (u.alias === user.alias) return null;

  if (battleRequest?.find((br) => br.from === u.alias)) {
    return inviteBox(u.alias);
  }

  return (
    <li
      ref={ref}
      className="user-box"
      key={u.alias}
      onClick={() => handleUserClick(u.alias)}
      onContextMenu={handleContextMenu}
    >
      <div className="friendlist-profile-icon">
        <Image
          className="friendlist-profile-icon-image"
          src={`${RESOURCES_URL}profileicon/${u.profile_icon}.png`}
          width={150}
          height={150}
        />
        <div className="box-status-icon" />
      </div>

      <div className="user-box-data">
        <span className="friendlist-username">{u.alias}</span>
        <span className="friendlist-status">Online</span>
        {/*chatUsers[u.alias]?.unreadCount > 0 && (
          <span className="unread-badge">
            {chatUsers[u?.alias]?.unreadCount}
          </span>
        )*/}
      </div>
    </li>
  );
});

export default memo(function RightNav({
  socket,
  battleRequest,
  handleEmitBattleRequest,
}) {
  const RESOURCES_URL =
    "/" ||
    "https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/";
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showMenu, setShowMenu] = useState();
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { user } = useUser();
  const { actualSection, userState, showSideNav, toggleSideNav } = useUserInterface();
  const { friendsOnline } = useConnectedUsers();
  const [hoveredUser, setHoveredUser] = useState(null);
  const toolTipPosRef = useRef({ x: 0, y: 0 });
  const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
  const { start, cancel } = useHoverIntent({ initialDelay: 400 });
  const {
    selectedChat,
    unreadCount,
    isChatVisible,
    openChat,
    selectChat,
    updateChatUser,
    toggleChatVisibility,
  } = useChat();
  const { logout } = useAuth();
  const { play: playClickSound } = useSound("/sfx/menu-click.mp3");

  const onHoverStart = (hovereduser) => {
    console.log(hovereduser)
    start({
      cb: () => {
        // Setear coords y hover juntos evita el "salto" del tooltip en equipos lentos.
        setToolTipPos({
          x: toolTipPosRef.current.x,
          y: toolTipPosRef.current.y,
        });
        setHoveredUser(hovereduser);
      },
    });
  };
  const onHoverEnd = () => {
    setHoveredUser(null);
    cancel();
  };
  const handleContextMenu = (e, username) => {
    e.preventDefault();
    const userName = username;
    selectChat(userName);
    setShowMenu(true);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };
  const handleLogout = () => {
    audioEngine.stopMusic();
    socket?.current.disconnect();
    localStorage.removeItem("token");
    logout();
  };
  const inviteBox = (userName) => {
    const userRequest = battleRequest.find(
      (request) => request.from == userName,
    );
    return (
      userRequest && (
        <div /*styles={{height:'200px'}}*/ className="invitation-box">
          <span>{userName} te ha invitado a un enfrentamiento</span>
          <div>
            <button /*onClick={()=>handleEmitAcceptBattleRequest(userRequest.roomId)}*/
            >
              Aceptar
            </button>
            <button>Rechazar</button>
          </div>
        </div>
      )
    );
  };

  // Update chat users when friends list changes
  useEffect(() => {
    if (friendsOnline) {
      friendsOnline.forEach((folder) => {
        folder.users.forEach((u) => {
          if (u.alias !== user.alias) {
            updateChatUser({
                userId: u.alias,
                userName: u.alias,
                profile_icon: u.profile_icon,
                profile_border: u.profile_border,
                status: u.status,
                unreadCount: 0,
              });
          }
        });
      });
    }
  }, [friendsOnline, user.alias, updateChatUser]);

  const handleUserClick = (userName) => {
    // Find the user in friendsOnline to get their profileIcon
    playClickSound();
    let profileIcon = 1;
    if (friendsOnline) {
      for (const folder of friendsOnline) {
        const foundUser = folder.users.find((u) => u.userName === userName);
        if (foundUser) {
          profileIcon = foundUser.profile_icon;
          break;
        }
      }
    }

    // Open chat with the selected user
    openChat({
        userId: userName,
        userName: userName,
        profile_icon: profileIcon,
      });
  };

  const handleChatButtonClick = () => {
    toggleChatVisibility();
  };

  const UserFriendList = () => {
    const [isFolderOpen, setIsFolderOpen] = useState(true);
    const iconStyle = isFolderOpen ? { transform: "rotate(90deg)" } : null;
    const folderStyle = !isFolderOpen ? { display: "none" } : null;

    return friendsOnline?.map((folder) => (
      <ul className="general-user-list" key={folder.name}>
        <div
          className="user-folder-name"
          onClick={() => setIsFolderOpen((p) => !p)}
        >
          <VscTriangleRight style={iconStyle} className="triangle" />
          {folder.name.toUpperCase() + " "}({folder.users.length}/
          {folder.users.length})
        </div>

        <div style={folderStyle}>
          {folder.users.map((u) => (
            <FriendRow
              key={u.alias}
              u={u}
              user={user}
              RESOURCES_URL={RESOURCES_URL}
              battleRequest={battleRequest}
              handleUserClick={handleUserClick}
              handleContextMenu={(e) => handleContextMenu(e, u.alias)}
              inviteBox={inviteBox}
              toolTipPosRef={toolTipPosRef}
              onHoverStart={() => onHoverStart(u)}
              onHoverEnd={onHoverEnd}
            />
          ))}
        </div>
      </ul>
    ));
  };

  return (
    <div
      style={{
        right: `${!showSideNav ? "-260px" : "0"}`,
        background: `${actualSection === "store" ? "linear-gradient(to top, var(--blue-five), #07161e 90%, var(--blue-five))" : "var(--blue-five)"}`,
      }}
      className={`right-nav`}
      onClick={() => setShowMenu(false)}
    >
      <ProfileBox handleLogout={handleLogout} user={user} setIsSettingsOpen={setIsSettingsOpen} toggleSideNav={toggleSideNav} userState={userState} />

      <div className="online-users">
        {showMenu && (
          <div
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
        )}
        <div className="social-menu">
          SOCIAL
          <div className="social-icons">
            <FaUserPlus className="social-icon" />
            <FaFolderPlus className="social-icon" />
            <GiHamburgerMenu className="social-icon" />
            <FaSearch className="social-icon" />
          </div>
        </div>
        {UserFriendList()}
      </div>
      <div className="right-nav-buttom-buttons">
        <button
          onClick={handleChatButtonClick}
          className={`right-nav-buttom-button ${isChatVisible && "active-button"}`}
        >
          <IoChatboxSharp />
          {unreadCount > 0 && (
            <span className="unread-count-badge">{unreadCount}</span>
          )}
        </button>
        <button className="right-nav-buttom-button news-button">
          <RiFilePaper2Fill />
        </button>
        <button className="right-nav-buttom-button">
          <FaMicrophone />
        </button>
        <span className="actual-version">1.1</span>
        <button className="right-nav-buttom-button bug-report-button">
          <MdBugReport />
        </button>
      </div>
      {isSettingsOpen && <Settings setIsSettingsOpen={setIsSettingsOpen} />}
      {hoveredUser && <UserTooltip hoveredUser={hoveredUser} tooltipPos={toolTipPos} />}
    </div>
  );
});
