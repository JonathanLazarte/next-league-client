"use client"

import "./SideNav.css";
import { useState, memo } from "react";



import { RiFilePaper2Fill } from "react-icons/ri";
import { MdBugReport } from "react-icons/md";
import { FaMicrophone } from "react-icons/fa6";
import { IoChatboxSharp } from "react-icons/io5";

import ProfileBox from "./ProfileBox";
import SocialPanel from "./SocialPanel";



import { useUserInterface } from "@/hooks/useUserInterface";
import { useChat } from "@/hooks/useChat";


export default memo(function RightNav() {
  const { actualSection, userState, showSideNav, updateSideNav } = useUserInterface();



  const {
    unreadCount,
    isChatVisible,
    toggleChatVisibility,
  } = useChat();





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
      <ProfileBox updateSideNav={updateSideNav} userState={userState} />
      <SocialPanel></SocialPanel>

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
  );
});
