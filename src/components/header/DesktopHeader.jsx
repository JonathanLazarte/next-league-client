"use client";

import "./header.css";
import HeaderMainButton from "@/components/playButton/HeaderMainButton/HeaderMainButton";
import { /*useState,*/ memo, useState } from "react";
import { GiStoneCrafting } from "react-icons/gi";
import { shallowEqual, useSelector } from "react-redux";
import { selectUserInterfaceData } from "@/redux/slices/userInterfaceSlice.ts";
import { useSound } from "@/hooks/useSound.js";
import { useRouter } from "@/hooks/useRouter.js";
import { flushSync } from "react-dom";
import { FaPlus } from "react-icons/fa6";
import useTooltipTrigger from '@/components/Tooltip/globalTooltip/TooltipTrigger'

export const Tab = ({ section, trigger, setSectionTabSeleceted, sectionTabSelected, actualSection }) => {
  const { play } = useSound("/general/menu-click.mp3");
  const router = useRouter();
  const [isMouseUp, setIsMouseUp] = useState();

  console.log(actualSection)

  const isPointerVisible = sectionTabSelected === section;
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
    setSectionTabSeleceted(section)
    setIsMouseUp(true);
    play();
    router.push(section);
  };

  if (section === "league")
    return (
      <div
        onClick={() => handleClick("league")}
        className="item-lol"
        style={sectionTabSelected === "league" ? selectedStyle : null}
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
      <div
        className={`item ${isMouseUp ? "onMouseUp" : null}`}
        style={sectionTabSelected === section ? selectedStyle : null}
        onMouseUp={() => handleClick(section)}
        {...trigger({content: section})}
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
  );
};

export default memo(function DesktopHeader({ showSideNav }) {
  const user = useSelector((state) => state.user, shallowEqual);
  const { actualSection } = useSelector(selectUserInterfaceData);
  const trigger = useTooltipTrigger()
  const [ sectionTabSelected, setSectionTabSeleceted ] = useState()

  return (
    <>
      <header
        style={{
          marginRight: !showSideNav ? "0px" : null,
        }}
        className="index-header"
      >
        <HeaderMainButton setSectionTabSelected={setSectionTabSeleceted} />
        <Tab
          setSectionTabSeleceted={setSectionTabSeleceted}
          sectionTabSelected={sectionTabSelected}
          actualSection={actualSection}
          trigger={trigger}
          section="league"
        />
        <div className="header-sections">
          <Tab
            trigger={trigger}
            section="collection"
            setSectionTabSeleceted={setSectionTabSeleceted}
            sectionTabSelected={sectionTabSelected}
            actualSection={actualSection}
          />
          {/*<Tab section="Botín" />*/}
          <div className="icon-separator" />
          <Tab
            trigger={trigger}
            section="store"
            setSectionTabSeleceted={setSectionTabSeleceted}
            actualSection={actualSection}
            sectionTabSelected={sectionTabSelected}
          />
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
