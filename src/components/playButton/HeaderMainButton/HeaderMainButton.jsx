"use client";

import "./HeaderMainButton.css";
import { useSelector } from "react-redux";
import { useRouter } from "@/hooks/useRouter.js";
import { selectUserInterfaceData } from "@/redux/slices/userInterfaceSlice.js";
import { useSound } from "@/hooks/useSound.js";

export default function PlayButton({ okButtonAction }) {
  const route = useRouter();
  const { actualSection, userState } = useSelector(selectUserInterfaceData);
  const { play: playHover } = useSound("/general/find-match-button-hover.mp3");
  const { play: playClick } = useSound("/general/find-match-button-click.mp3");
  // Texto dinámico del botón
  const getButtonText = () => {
    if (userState !== "Online") return "GRUPO";
    if (userState.includes("match") || userState === "In match")
      return "EN PARTIDA";
    return "JUEGA";
  };

  const handleClick = () => {
    playClick();

    // Si hay acción personalizada (por ejemplo desde el lobby PvP), usarla
    if (okButtonAction) {
      okButtonAction();
      return;
    }

    // Comportamiento por defecto: abrir selección de modos
    if (actualSection !== "room") {
      route.push("room");
    }
  };

  const isActive = actualSection === "room" || userState !== "Online";

  return (
    <div className="lol-main-button">
      {/* Logo circular izquierdo */}
      <div className="lol-main-button__logo-container">
        <div className="lol-main-button__logo" />
      </div>

      {/* Botón principal */}
      <div
        className={`lol-main-button__action-box ${isActive ? "selected" : ""}`}
        onMouseEnter={() => playHover()}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Abrir selección de modo"
      >
        <div className={`lol-main-button__text ${isActive ? "selected" : ""}`}>
          {getButtonText()}
        </div>

        <svg
          className={`lol-main-button__action-border ${isActive ? "selected" : ""}`}
          id="Capa_2"
          style={{ width: "100%" }}
          data-name="Capa 2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 873.93 215"
        >
          <g id="Capa_1-2" data-name="Capa 1">
            <path
              className="svg-border"
              d="M1,215c7.16-8.34,15.66-15.34,22.41-24.09,38.95-50.45,36.83-119.79-2.44-169.39C14.54,13.41,7.13,7.33,0,0h766.5l107.43,108.64-105.43,106.36H1ZM29,10c-.38,1.63.33,2.31.98,3.52,3.26,6.11,10.73,13.27,14.83,20.17,28.34,47.75,27.09,106.9-3.4,153.21-2.15,3.26-10.61,12.37-11.22,14.81-.34,1.36.39,3.28,1.31,3.28h726c23.9-24.72,49.63-48.49,73.53-73.47,7.12-7.44,14.3-15.44,21.01-23.03l-95.54-98.5H29Z"
            />
          </g>
          <defs>
            <linearGradient id="myGradient" gradientTransform="rotate(90)">
              <stop
                offset="5%"
                className="stop-1"
                stop-color="var(--start-color1, #08b4b1)"
              />
              <stop
                offset="95%"
                className="stop-2"
                stop-color="var(--end-color1, #016587)"
              />
            </linearGradient>

            <linearGradient id="myGradient2" gradientTransform="rotate(90)">
              <stop offset="5%" stop-color="var(--start-color2, #94ebe5)" />
              <animate
                attributeName="stop-color"
                values="#08b4b1;red"
                dur="0.5s"
                repeatCount="1"
              />
              <stop offset="45%" stop-color="var(--into-color2, #0cbbad)" />
              <stop offset="95%" stop-color="var(--end-color2, #1ea2bf)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
