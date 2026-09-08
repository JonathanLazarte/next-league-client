"use client";

import { useState, memo } from "react";
import { useSound } from "@/hooks/useSound";

import ModeSelector from "./ModeSelector";
import Pvp from "./rooms/pvp/PvpLobby";

import "./play.css";
import { useUserInterface } from "@/hooks/useUserInterface";
import { GAME_DATA } from '@/utils/constants'


export default memo(function ModeSelection(){
  const { queue } = useUserInterface()
  console.log(queue)
  const [ categorySelected, setCategorySelected ] = useState("PVP");
  const { play: playMenuClick } = useSound("/general/menu-click.mp3");

  const handleCategoryChange = (category) => {
    playMenuClick();
    GAME_DATA[category] && setCategorySelected(category)
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
    queue !== null;
    const activeGameMode = Object.keys(GAME_DATA).find(key => GAME_DATA[key]?.some(map => map.queues?.some(q => q.name === queue)));

  return (
    <div className="play-screen-container">
      {!isQueueSelected && <PlaySelectionLayer />}
      {activeGameMode === "PVP" && (
        <Pvp
          roomTitle={queue}
        />
      )}
      {activeGameMode === "CO_OP_VS_AI" &&
        <Pvp
          roomTitle={queue}
        />}
    </div>
  );
});
