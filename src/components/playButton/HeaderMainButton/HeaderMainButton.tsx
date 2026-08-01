"use client";

import "./HeaderMainButton.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "@/hooks/useRouter.js";
import { selectUserInterfaceData } from "@/redux/slices/userInterfaceSlice";
import { useSound } from "@/hooks/useSound.js";

type Button = 'idle' | 'disabled' | 'hovered' | 'lobby' | 'lobby-hovered';

export default function PlayButton({ okButtonAction }) {
  const route = useRouter();
  const { actualSection, userState } = useSelector(selectUserInterfaceData);
  const [ buttonState, setButtonState ] = useState<Button>('idle')
  const { play: playHover } = useSound("/general/find-match-button-hover.mp3");
  const { play: playClick } = useSound("/general/find-match-button-click.mp3");
  const videoRef = useRef({})
  const isUserInLobby = userState !== 'online'

  useEffect(() => {
    if (actualSection !== "play" && isUserInLobby && buttonState === 'disabled') {
      setButtonState('lobby')
    }
    if (actualSection !== "play" && !isUserInLobby && buttonState === 'disabled') {
      setButtonState('idle')
    }
  }, [actualSection]);
  // Texto dinámico del botón
  const getButtonText = () => {
    if (userState !== "online") return "GROUP";
    if (userState.includes("match") || userState === "in game")
      return "EN PARTIDA";
    return "PLAY";
  };

  const handleClick = () => {
    if (actualSection === 'play') return;

    if(buttonState !== 'disabled') playClick();
    setButtonState('disabled');

    // Si hay acción personalizada (por ejemplo desde el lobby PvP), usarla
    if (okButtonAction) {
      okButtonAction();
      return;
    }

    // Comportamiento por defecto: abrir selección de modos
      route.push("play");
  };
  const handleMouseEnter = () => {
    if (buttonState === 'disabled') return;
    if (buttonState === 'lobby') return setButtonState('lobby-hovered');
    playHover();
    setButtonState("hovered");
  }
  const handleMouseLeave = () => {
    if (buttonState === 'disabled') return
    if (buttonState === 'lobby-hovered') return setButtonState('lobby')
    setButtonState("idle")
  }

  useEffect(() => {

  }, [buttonState])

  return (
    <div className="lol-main-button">
      <img className="container-frame" src='/play-button/play-button-frame-disabled.png'></img>
      {/* Logo circular izquierdo */}
      <video
        src='/league-logo-loop-idle.webm'
        autoPlay
        loop
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        className="videobg"
      />
      <div className="main-button-right-frame"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          style={{opacity: buttonState === 'idle' ? 1 : 0}}
          className="play-frame"
          src='/play-button/play-button-default.png'
        />
        <img
          style={{opacity: buttonState === 'hovered' ? 1 : 0}}
          className="play-frame"
          src='/play-button/play-button-hover.png'
        />
        <img
          style={{opacity: buttonState === 'disabled' ? 1 : 0}}
          className="play-frame"
          src='/play-button/play-button-disabled.png'
        />
        <img
          style={{opacity: buttonState === 'lobby' ? 1 : 0}}
          className="play-frame"
          src='/play-button/play-button-lobby-default.png'
        />
        <img
          style={{opacity: buttonState === 'lobby-hovered' ? 1 : 0}}
          className="play-frame"
          src='/play-button/play-button-lobby-hover.png'
        />
        <video
          className="play-button-effect-video"
          autoPlay
          loop
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          src='/play-button/play-button-hover-loop.webm'
          ref={(el) => {
            videoRef.current['hover'] = el
          }}
          style={{display: buttonState === 'hovered' ? 'block' : 'none'}}
        />
        <span className={`main-button-text ${buttonState === 'disabled' ? 'disabled' : ''}`}>{getButtonText()}</span>
      </div>
    </div>
  );
}
