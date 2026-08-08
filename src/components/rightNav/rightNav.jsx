"use client";

import "./rightNav.css";
import { useState, memo, useEffect, useRef } from "react";


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
import Friend from './Friend'

import useHoverIntent from "@/hooks/useHoverIntent.js";
import { useUserInterface } from "@/hooks/useUserInterface";
import { useConnectedUsers } from "@/hooks/useConnectedUsers";
import { useChat } from "@/hooks/useChat";


export const SocialPanel = ({ tooltipPosRef, onHoverEnd, onHoverStart }) => {
  const [showMenu, setShowMenu] = useState();
  //const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const iconStyle = isFolderOpen ? { transform: "rotate(90deg)" } : null;
  const folderStyle = !isFolderOpen ? { display: "none" } : null;
  const { friendsOnline } = useConnectedUsers();
  const {
    updateChatUser,
    battleRequest
  } = useChat();

  // Update chat users when friends list changes
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

  return friendsOnline?.map((folder) => (
    <>
      <div onClick={() => setShowMenu(false)} className="online-users">
        {showMenu && (null/*<Menu></Menu>*/) }
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
            user={u}
            key={u.alias}
            battleRequest={battleRequest}
            inviteBox={inviteBox}
            toolTipPosRef={tooltipPosRef}
            onHoverStart={() => onHoverStart(u)}
            onHoverEnd={onHoverEnd}
          />
        ))}
      </div>
      </ul>
    </>
  ));
};


export default memo(function RightNav() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { actualSection, userState, showSideNav, updateSideNav } = useUserInterface();
  const [hoveredUser, setHoveredUser] = useState(null);
  const toolTipPosRef = useRef({ x: 0, y: 0 });
  const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
  const { start, cancel } = useHoverIntent({ initialDelay: 400 });

  const {
    unreadCount,
    isChatVisible,
    toggleChatVisibility,
  } = useChat();

  const onHoverStart = (hovereduser) => {
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







  const handleChatButtonClick = () => {
    toggleChatVisibility();
  };

  return (
    <div
      style={{
        right: `${!showSideNav ? "-260px" : "0"}`,
        background: `${actualSection === "store" ? "linear-gradient(to top, var(--blue-five), #07161e 90%, var(--blue-five))" : "var(--blue-five)"}`,
      }}
      className="right-nav"
    >
      <ProfileBox setIsSettingsOpen={setIsSettingsOpen} updateSideNav={updateSideNav} userState={userState} />
      <SocialPanel onHoverEnd={onHoverEnd} onHoverStart={onHoverStart} tooltipPosRef={toolTipPosRef} ></SocialPanel>

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
      {hoveredUser && <UserTooltip hoveredUser={hoveredUser} tooltipPosRef={toolTipPosRef} tooltipPos={toolTipPos} />}
    </div>
  );
});
