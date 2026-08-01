"use client";

import "./header.css";
import HeaderMainButton from "@/components/playButton/HeaderMainButton/HeaderMainButton";
import { /*useState,*/ memo, useState } from "react";
import { GiStoneCrafting } from "react-icons/gi";
import { shallowEqual, useSelector } from "react-redux";
import { selectUserInterfaceData } from "@/redux/slices/userInterfaceSlice.ts";
import MiniTooltip from "@/components/ToolTip/miniTooltip/miniTooltip.jsx";
import { useSound } from "@/hooks/useSound.js";
import { useRouter } from "@/hooks/useRouter.js";
import { flushSync } from "react-dom";
import { FaPlus } from "react-icons/fa6";

export default memo(function DesktopHeader({ showSideNav }) {
  const user = useSelector((state) => state.user, shallowEqual);
  const { actualSection, userState } = useSelector(selectUserInterfaceData);
  const { play } = useSound("/general/menu-click.mp3");
  const router = useRouter();


  const Tab = ({ section }) => {
    const [isMouseUp, setIsMouseUp] = useState();
    const isPointerVisible = actualSection === section;
    const selectedStyle = {
      background:
        "linear-gradient(rgba(9, 17, 30, 0) 35%, rgba(212, 175, 120, 0.5))",
      color: "#F0E6D2",
      cursor: "default",
      pointerEvents: "none",
    };

    const handleClick = (section) => {
      flushSync(() => {
        setIsMouseUp(true);
      });

      setIsMouseUp(true);
      play();
      router.push(section);
    };

    if (section === "league")
      return (
        <div
          onClick={() => handleClick("league")}
          className="item-lol"
          style={actualSection === "league" ? selectedStyle : null}
        >
          LEAGUE
          <img
            style={{
              display: isPointerVisible ? "block" : "none",
            }}
            className="header-pointer"
            src="/header-pointer.png"
          />
        </div>
      );
    return (
      <MiniTooltip
        delay={100}
        position="bottom"
        content={section}
        disabled={actualSection === section}
      >
        <div
          className={`item ${isMouseUp ? "onMouseUp" : null}`}
          style={actualSection === section ? selectedStyle : null}
          onMouseUp={() => handleClick(section)}
        >
          <img
            style={{
              display: isPointerVisible ? "block" : "none",
            }}
            className="header-pointer"
            src="/header-pointer.png"
          />
          <svg fill="currentColor">
            <use href={`/icon.svg#${section}`} />
            {section === "Botín" && <GiStoneCrafting fontSize="1.4rem" />}
          </svg>
        </div>
      </MiniTooltip>
    );
  };

  return (
    <>
      <header
        style={{
          marginRight: !showSideNav ? "0px" : null,
          marginTop:
            userState === "In explore match" || userState === "In normal match"
              ? "-110px"
              : "0px",
        }}
        className="index-header"
      >
        <HeaderMainButton text="JUEGA" />
        <Tab section="league" />
        <div className="header-sections">
          <Tab section="collection" />
          {/*<Tab section="Botín" />*/}
          <div className="icon-separator" />
          <Tab section="store" />
          <div className="icon-separator" />

          <div className="account-coins">
            <div className="riot-points">
              <img src="/general/RP_icon.png" alt="RP" />
              <div className="RP">
                {user.RP > 10000
                  ? `${Math.floor(user.RP / 1000)} K`
                  : user.RP || 0}
              </div>
              <div className="header-buy-rp-button">
                <div className="buy-rp-icon">
                  <FaPlus />
                </div>
              </div>
            </div>
            <div className="blue-essences">
              <img src="/general/BE_icon.png" alt="BE" />
              <div className="BE">
                {user.BE > 10000
                  ? `${Math.floor(user.BE / 1000)} K`
                  : user.BE || 0}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
});
