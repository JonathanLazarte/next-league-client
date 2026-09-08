"use client";

import "./SideNav.css";
import { useState, memo,useRef } from "react";



import { RiFilePaper2Fill } from "react-icons/ri";

import { MdBugReport } from "react-icons/md";

import { FaMicrophone } from "react-icons/fa6";

import { IoChatboxSharp } from "react-icons/io5";

import UserTooltip from "@/components/tooltips/UserTooltip/UserTooltip";
import Settings from "@/components/Settings/Settings";
import ProfileBox from "./ProfileBox";
import SocialPanel from "./SocialPanel";


import useHoverIntent from "@/hooks/useHoverIntent";
import { useUserInterface } from "@/hooks/useUserInterface";
import { useChat } from "@/hooks/useChat";

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
      }}
      className={`sidenav ${actualSection === 'store' ? "in-store" : ""}`}
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
