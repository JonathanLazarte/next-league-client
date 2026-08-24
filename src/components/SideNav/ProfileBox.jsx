"use client";

import { useState } from "react";
import { useUserInterface } from "@/hooks/useUserInterface";
import { IoIosSettings } from "react-icons/io";
import { MdMinimize, MdOutlineQuestionMark } from "react-icons/md";
import { PiXBold } from "react-icons/pi";
import { audioEngine } from "@/engine/audioEngine.js";
import { RESOURCES_URL } from '@/utils/constants'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from "@/hooks/useUser";

const ProfileBox = ({ setIsSettingsOpen, updateSideNav, userState, socket }) => {
  const { user } = useUser();
  const { queue, queueStatus, updateUserState } = useUserInterface();
  const [iconIsInHover, setIconIsInHover] = useState(false);
  const showPerfilSpanStyle = iconIsInHover
    ? { marginLeft: "1rem", visibility: "visible" }
    : null;
  const userStateLabel = {
    online: "Online",
    away: "Away",
    in_game: "In Game",
    offline: "Offline",
    ranked_solo_duo: "Ranked Solo/Duo",
    ranked_flex: "Ranked Flex",
    swiftplay: "Swiftplay",
    aram: "Aram",
    aram_mayhem: "Aram: Mayhem",
    intro: "Intro",
    beginner: "Beginner",
    intermediate: "Intermediate",
  };
  const { logout } = useAuth();

  const handleLogout = () => {
    audioEngine.stopMusic();
    socket?.current.disconnect();
    localStorage.removeItem("token");
    localStorage.setItem("explicit-logout", true)
    logout();
  };

  const toggleState = () => {
    const statusToSet = userState === 'online' ? 'offline' : 'online'
    updateUserState(statusToSet)
  };
  return (
    <div style={{ position: "relative" }} className="user-info">
      <div
        onMouseEnter={() => setIconIsInHover(true)}
        onMouseLeave={() => setIconIsInHover(false)}
        className="user-icon-wrapper"
      >
        <div className="user-level-wrapper">
          <span className="user-level">{user.level}</span>
        </div>
        <svg
          className="user-icon-border-svg"
          id="Capa_2"
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1039.49 1129.33"
        >
          <defs>
            <linearGradient id="hextech-metal-gradient" gradientTransform="rotate(90)">
              <stop offset="0%" stopColor="var(--hextech-metal-start)" />
              <stop offset="100%" stopColor="var(--hextech-metal-end)" />
            </linearGradient>
            <pattern
              id="profile-icon-pattern"
              patternUnits="objectBoundingBox"
              width="1"
              height="1"
            >
              <image
                href={`${RESOURCES_URL}/profileicon/${user.profile_icon || 5}.png`}
                width="750"
                height="750"
                x="2%"
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          </defs>

          <g id="Capa_1-2" data-name="Capa 1">
            <g>
              <g>
                <path className="cls-1" d="M503.37,138.57c208.14-10.71,377.59,144.91,399.83,349.07,15.71,144.26-45.53,287.13-164.46,369.97-4.02.62-10.82-17-16.79-15.88l-385.82-.03c-6.8.89-12.86,16.67-17.45,19.58-.89.57-1.31.44-2.25.32-3.03-.41-18.07-11.78-21.64-14.44-113.67-84.47-175.2-228.25-154.85-369.5,25.86-179.5,180.17-329.66,363.42-339.09Z" />
                <g>
                  <path className="cls-2" d="M339.39,848.95h377.34s100.34,135.19,100.34,135.19l-100.3,137.23-375.39-.04-109.62-135.16,1.54-3.48,106.08-133.74ZM348.02,1099.21l4.83,2.67,343.15.72c4.93-.42,10.08-.45,12.86-5.13,22.62-35.9,52.07-69.7,74.36-105.52,3.8-6.1,4.34-6.39.43-13.04l-76.77-107.1-5.13-3.86h-348.35s-3.71,2.29-3.71,2.29l-86.94,111.91c-2.49,4.17-2.08,5.49.56,9.43l84.72,107.63Z" />
                  <path d="M348.02,1099.21l-84.72-107.63c-2.64-3.94-3.05-5.27-.56-9.43l86.94-111.91,3.71-2.29h348.35s5.13,3.86,5.13,3.86l76.77,107.1c3.91,6.65,3.37,6.94-.43,13.04-22.29,35.82-51.73,69.61-74.36,105.52-2.78,4.68-7.93,4.71-12.86,5.13l-343.15-.72-4.83-2.67Z" />
                </g>
              </g>
              <g>
                <path d="M725.23,1129.33l-390.56-.28-112.78-139.06c-4.72-5.77,11.95-16.33,9.39-20.34C111.18,889.07,27.48,756.85,6.04,613.28-46.88,258.83,255.59-49.03,611.87,6.52c294.7,45.94,474.1,347.1,417.08,632.6-26.58,133.1-100.53,249.17-211.15,327.52-1.37,2.76,14.12,15.75,10.04,20.96l-102.61,141.73ZM254.73,940.69c-83.53-53.04-148.21-135.97-184.36-227.86-87.06-221.27-2.74-474.79,197.07-600.33,272.24-171.04,613.22-41.75,710.1,260.83,62.73,195.91,5.96,407.69-151.15,539.87-9.97,8.38-20.68,15.89-30.89,23.96l15.38,20.25c159.55-110.25,239.17-305.79,213.24-497.76C984.28,164.7,718.71-42,420.6,20.84,139.92,80-41.31,366.74,22.37,646.91c28.96,127.41,106.03,241.52,214.42,314.25l2.96.04,14.98-20.51ZM796.04,238.56c102.12,101.71,141.48,258.12,106,397.57-23.82,93.6-80.01,175.37-158.6,231.11l11.47,14.4c159.46-111.17,217.85-319.7,152.15-501.78-69.82-193.52-268.36-310.16-472.46-263.07C214.71,167.52,71.36,383.75,111.14,607.11c20.33,114.12,89.14,217.57,186.07,280.43l11.38-14.32c-78.54-52.34-138.83-130.04-167.05-220.56-64.75-207.71,48.18-431.87,251.59-504.41,142.98-50.99,296.13-16.04,402.91,90.3ZM503.37,138.57c-183.25,9.43-337.56,159.59-363.42,339.09-20.35,141.25,41.18,285.03,154.85,369.5,3.57,2.66,18.61,14.03,21.64,14.44.94.13,1.36.25,2.25-.32,4.59-2.92,10.65-18.69,17.45-19.58l385.82.03c5.96-1.13,12.77,16.5,16.79,15.88,118.92-82.84,180.17-225.71,164.46-369.97-22.23-204.16-191.69-359.78-399.83-349.07ZM339.39,848.95l-106.08,133.74-1.54,3.48,109.62,135.16,375.39.04,100.3-137.23-100.34-135.19h-377.34Z" />
                <path className="cls-3" d="M254.73,940.69l-14.98,20.51-2.96-.04c-108.38-72.73-185.45-186.84-214.42-314.25C-41.31,366.74,139.92,80,420.6,20.84c298.11-62.83,563.69,143.86,603.52,438.83,25.92,191.96-53.69,387.51-213.24,497.76l-15.38-20.25c10.21-8.07,20.92-15.58,30.89-23.96,157.11-132.18,213.88-343.96,151.15-539.87C880.66,70.76,539.68-58.54,267.44,112.51,67.63,238.05-16.69,491.57,70.37,712.83c36.16,91.89,100.83,174.82,184.36,227.86Z" />
                <path id="thepath" className="cls-4" d="M796.04,238.56c-106.78-106.34-259.93-141.29-402.91-90.3-203.41,72.54-316.34,296.7-251.59,504.41,28.22,90.52,88.51,168.23,167.05,220.56l-11.38,14.32c-96.94-62.86-165.74-166.31-186.07-280.43-39.79-223.36,103.57-439.59,323.46-490.33,204.09-47.09,402.64,69.55,472.46,263.07,65.69,182.08,7.31,390.62-152.15,501.78l-11.47-14.4c78.59-55.74,134.78-137.51,158.6-231.11,35.49-139.44-3.87-295.86-106-397.57Z" />
              </g>
            </g>
          </g>

        </svg>
      </div>

      <div className="user-state">
        <div className="user-options">
          <MdOutlineQuestionMark className="accountOptionIcon" onClick={() => { }} />
          <MdMinimize
            onClick={() => {
              window.innerWidth < 1200 ? updateSideNav() : null;
            }}
            className="accountOptionIcon"
          />
          <IoIosSettings
            className="accountOptionIcon"
            onClick={() => setIsSettingsOpen(true)}
          />
          <PiXBold onClick={() => handleLogout()} className="accountOptionIcon" />
        </div>
        {!iconIsInHover && (
          <>
            <h3 className="right-nav-username">{user.alias}</h3>
            <div
              className={`user-status ${queueStatus !== "idle" ? "active-queue" : userState === "offline" ? "offline" : ""}`}
              onClick={toggleState}
            >
              <div className="status-icon"></div>
              {queueStatus === "idle"
                ? `${queue !== null ? "1/5 " : ""}${userStateLabel[queue !== null ? queue : userState]}`
                : "In Queue"}
            </div>
          </>
        )}
        <span className="showPerfilSpan" style={showPerfilSpanStyle}>
          View Profile
        </span>
      </div>
    </div>
  );
};

export default ProfileBox;
