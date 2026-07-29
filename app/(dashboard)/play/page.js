"use client";

import { useState, memo } from "react";
import { useSelector } from "react-redux";
import { useSound } from "@/hooks/useSound.js";

import ModeSelector from "./ModeSelector.jsx";
import Pvp from "./PvpRoom/index.jsx";
/*import dynamic from "next/dynamic";
const Pvp = dynamic(() => import("./PvpRoom/index.jsx"), {
  ssr: false
})
const Training = dynamic(() => import("./PvpRoom/index.jsx"), {
  ssr: false
})*/
/*

*/
import "./play.css";

export const GAME_DATA = {
  PVP: [
    {
      name: "summoner rift",
      hoverImg: "sr-hover.png",
      enabledImg: "sr-enabled.png",
      disabledImg: "sr-desabled.png",
      subTitle: "1v1",
      title: "SUMMONER'S RIFT",
      queues: [
        {
          name: "swiftplay",
          description:
            "Authentic SR gameplay in a much shorter match. Play with friends of different skill levels without the fear of falling too far behind.",
          room_title: "SR · Swiftplay · ",
        },
        {
          name: "ranked_solo_duo",
          description:
            "Crush your lane, dive into epic five-on-five team fights, and destroy the enemy nexus in League`s premier competitive mode.",
          room_title: "SR · Ranked Solo/Duo · Draft",
        },
        {
          name: "ranked_flex",
          description:
            "Crush your lane, dive into epic five-on-five team fights, and destroy the enemy nexus in League`s premier competitive mode.",
          room_title: "SR · Ranked Flex · Draft",
        },
      ],
    },
    {
      name: "aram",
      hoverImg: "aram-hover.png",
      enabledImg: "aram-active.png",
      disabledImg: "aram-default.png",
      subTitle: "5v5",
      title: "ARAM",
      queues: [
        {
          name: "aram_mayhem",
          description:
            "Ten randomly-selected champions assemble on a narrow bridge. Cross to the other side and destroy everything in your path.",
          room_title: "RNG · ARAM: MAYHEM · RANDOM",
        },
        {
          name: "aram",
          description:
            "Ten randomly-selected champions assemble on a narrow bridge. Cross to the other side and destroy everything in your path.",
          room_title: "RNG · ARAM · RANDOM",
        },
      ],
    },
  ],
  CO_OP_VS_AI: [
    {
      name: "co-op vs ai",
      hoverImg: "sr-hover.png",
      enabledImg: "sr-enabled.png",
      disabledImg: "sr-desabled.png",
      subTitle: "1v1",
      title: "CO-OP VS AI",
      queues: [
        {
          name: "intro",
          description: "Team up with other players against a team of boths and destroy the enemy Nexus.",
          room_title: "SR · Intro · Blind",
        },
        {
          name: "beginner",
          description: "Team up with other players against a team of boths and destroy the enemy Nexus.",
          room_title: "SR · Begginer · Blind",
        },
        {
          name: "intermediate",
          description: "Team up with other players against a team of boths and destroy the enemy Nexus.",
          room_title: "SR · Intermediate · Blind",
        },
      ],
    },
  ],
};
export default memo(function ModeSelection({
  socket,
  connectedUsers,
  roomUsers,
  setRoomUsers,
}) {
  const { userState } = useSelector((state) => state.userInterface);
  const [categorySelected, setCategorySelected] = useState("PVP");
  const { play: playMenuClick } = useSound("/general/menu-click.mp3");

  const handleCategoryChange = (category) => {
    playMenuClick();
    GAME_DATA[category]
      ? setCategorySelected(category)
      : console.log("categoria incorrecta");
  };
  // Si ya eligió modo → mostrar sala o exploración

  const PlaySelectionLayer = () => {
    return (
      <section className="play-selection-modes">
        <header className="mode-selection-header">
          <div
            className={`subheader-tab ${categorySelected === "PVP" ? "active-subheader-tab" : ""}`}
            onClick={() => handleCategoryChange("PVP")}
            /*onMouseEnter={() => playConfirmButtonHover()}*/
          >
            PVP
          </div>
          <div
            className={`subheader-tab ${categorySelected === "CO_OP_VS_AI" ? "active-subheader-tab" : ""}`}
            onClick={() => handleCategoryChange("CO_OP_VS_AI")}
            /*onMouseEnter={() => playConfirmButtonHover()}*/
          >
            CO-OP VS AI
          </div>
        </header>
        <ModeSelector data={GAME_DATA[categorySelected]} />
      </section>
    );
  };

  const isQueueSelected =
    userState !== "online";
    const activeGameMode = Object.keys(GAME_DATA).find(key => GAME_DATA[key]?.some(map => map.queues?.some(q => q.name === userState)));

  return (
    <div className="play-screen-container">
      {!isQueueSelected && <PlaySelectionLayer />}
      {activeGameMode === "PVP" && (
        <Pvp
          socket={socket}
          connectedUsers={connectedUsers}
          roomUsers={roomUsers}
          setRoomUsers={setRoomUsers}
          roomTitle={userState}
        />
      )}
      {activeGameMode === "CO_OP_VS_AI" &&
        <Pvp
          socket={socket}
          connectedUsers={connectedUsers}
          roomUsers={roomUsers}
          setRoomUsers={setRoomUsers}
          roomTitle={userState}
        />}
    </div>
  );
});
