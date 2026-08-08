/*import { useState, useEffect, useRef } from "react";

import { FaUserPlus } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa";
import { RiFilePaper2Fill } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa6";
import { VscTriangleRight } from "react-icons/vsc";
import { IoChatboxSharp } from "react-icons/io5";

import UserTooltip from "@/components/Tooltip/userTooltip/userTooltip.jsx";
import Friend from '@/components/rightNav/Friend'

import useHoverIntent from "@/hooks/useHoverIntent.js";
import { useSmartHover } from "@/hooks/useSmartHover.js";
import { useSound } from "@/hooks/useSound.js";
import { useUserInterface } from "@/hooks/useUserInterface";
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import { useChat } from "@/hooks/useChat";
import { useUser } from "@/hooks/useUser";

export const SocialPanel = ({
  battleRequest,
  socket,
  toolTipPosRef,
  onHoverStart,
  onHoverEnd,
  handleUserClick
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const iconStyle = isFolderOpen ? { transform: "rotate(90deg)" } : null;
  const folderStyle = !isFolderOpen ? { display: "none" } : null;

  const { user } = useUser();
  const { friendsOnline, setFriendsOnline } = useConnectedUsers();
  const {
    selectedChat,
    isChatVisible,
    selectChat,
    updateChatUser,
    toggleChatVisibility,
    addMessage,
    unreadCount
  } = useChat();


  const handleContextMenu = (e, username) => {
    e.preventDefault();
    selectChat(username);
    setShowMenu(true);
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };

  // Lógica de Socket.IO para el chat y user-list
  useEffect(() => {
    if (!socket?.current) return;
    socket.current.on("chat-message", (msg) => {
      addMessage(msg);
    });
    return () => socket.current?.off("chat-message");
  }, [addMessage, socket]);

  useEffect(() => {
    if (!socket?.current) return;
    socket.current.on("user-list", (msg) => {
      const friendFolders = [{ name: "general", users: msg }];
      setFriendsOnline(friendFolders);
    });
    return () => socket.current?.off("user-list");
  }, [setFriendsOnline, socket]);

  useEffect(() => {
    if (friendsOnline) {
      friendsOnline.forEach((folder) => {
        folder.users.forEach((u) => {
            updateChatUser({
                userId: u.alias,
                userName: u.alias,
                profile_icon: u.profile_icon,
                profile_border: u.profile_border,
                status: u.status,
                unreadCount: 0,
              });
        });
      });
    }
  }, [friendsOnline, updateChatUser]);

  const inviteBox = (userName) => {
    const userRequest = battleRequest?.find(
      (request) => request.from == userName,
    );
    return (
      userRequest && (
        <div className="invitation-box">
          <span>{userName} te ha invitado a un enfrentamiento</span>
          <div>
            <button>Aceptar</button>
            <button>Rechazar</button>
          </div>
        </div>
      )
    );
  };

  const Menu = () => (
    <div
      className="custom-menu"
      style={{
        position: "fixed",
        left: menuPosition.x,
        top: menuPosition.y,
      }}
    >
      <h5
        className={selectedChat == user?.userName ? "blocked" : null}
        onClick={() => {
          setShowMenu(false);
          // handleEmitBattleRequest(); // Esto necesitaría ser pasado como prop si se requiere
        }}
      >
        Invitar a una partida
      </h5>
      <h5 onClick={() => setShowMenu(false)}>Ver perfil</h5>
    </div>
  );

  return friendsOnline?.map((folder) => (
    <div key={folder.name + "_wrapper"}>
      <div onClick={() => setShowMenu(false)} className="online-users">
        {showMenu && <Menu /> }
        <div className="social-menu">
          SOCIAL
          <div className="social-icons">
            <FaUserPlus className="social-icon" />
            <FaFolderPlus className="social-icon" />
            <GiHamburgerMenu className="social-icon" />
            <FaSearch className="social-icon" />
          </div>
        </div>
      </div>
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
            <Friend
              key={u.alias}
              battleRequest={battleRequest}
              handleUserClick={() => handleUserClick(u)}
              handleContextMenu={(e) => handleContextMenu(e, u.alias)}
              inviteBox={inviteBox}
              toolTipPosRef={toolTipPosRef}
              onHoverStart={() => onHoverStart(u)}
              onHoverEnd={onHoverEnd}
            />
          ))}
        </div>
      </ul>
      <div className="right-nav-buttom-buttons">
        <button
          onClick={toggleChatVisibility}
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
    </div>
  ));
};
      {hoveredUser && <UserTooltip hoveredUser={hoveredUser} tooltipPos={toolTipPos} />}
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
    </div>
  ));
};
*/
