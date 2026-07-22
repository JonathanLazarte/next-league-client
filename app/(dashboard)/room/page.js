"use client";

import { useState, memo } from "react";
import { useSelector } from "react-redux";
import { useSound } from "@/hooks/useSound.js";

import ModeSelector from "./ModeSelector.jsx";
import Training from "./Training/training.jsx";
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
import "./room.css";

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
          name: "Swiftplay",
          description:
            "Authentic SR gameplay in a much shorter match. Play with friends of different skill levels without the fear of falling too far behind.",
        },
        {
          name: "Ranked Solo/Duo",
          description:
            "Crush your lane, dive into epic five-on-five team fights, and destroy the enemy nexus in League`s premier competitive mode.",
        },
        {
          name: "Ranked Flex",
          description:
            "Crush your lane, dive into epic five-on-five team fights, and destroy the enemy nexus in League`s premier competitive mode.",
        },
      ],
    },
  ],
  TRAINING: [
    {
      name: "tutorial",
      hoverImg: "sr-hover.png",
      enabledImg: "sr-enabled.png",
      disabledImg: "sr-desabled.png",
      subTitle: "1v1",
      title: "TUTORIAL",
      queues: [
        {
          name: "Intermedio",
          description: "Learn the basics in this instructive tutorial flow",
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
            className={`subheader-tab ${categorySelected === "TRAINING" ? "active-subheader-tab" : ""}`}
            onClick={() => handleCategoryChange("TRAINING")}
            /*onMouseEnter={() => playConfirmButtonHover()}*/
          >
            TRAINING
          </div>
        </header>
        <ModeSelector data={GAME_DATA[categorySelected]} />
      </section>
    );
  };

  const isQueueSelected =
    userState === "Ranked Solo/Duo" ||
    userState === "Intermedio" ||
    userState === "Ranked Flex" ||
    userState === "Swiftplay";
  //const typeOfRoom = GAME_DATA['PVP'].find(map => map?.queues?.some(q => q.name === userState))

  return (
    <div className="play-screen-container">
      {!isQueueSelected && <PlaySelectionLayer />}
      {(userState === "Ranked Solo/Duo" ||
        userState === "Ranked Flex" ||
        userState === "Swiftplay") && (
        <Pvp
          socket={socket}
          connectedUsers={connectedUsers}
          roomUsers={roomUsers}
          setRoomUsers={setRoomUsers}
        />
      )}
      {userState === "Intermedio" && <Training />}
    </div>
  );
});
