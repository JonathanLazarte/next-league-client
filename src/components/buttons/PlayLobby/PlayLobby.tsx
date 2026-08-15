"use client";

import "./PlayLobby.css";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useUserInterface } from "@/hooks/useUserInterface";
import { useSound } from "@/hooks/useSound";

type Button = 'idle' | 'disabled' | 'hovered' | 'lobby' | 'lobby-hovered';

export default function LobbyPlayButton({ setSectionTabSelected }) {
  const route = useRouter();
  const { actualSection, queue } = useUserInterface();
  const [ buttonState, setButtonState ] = useState<Button>('idle')
  const { play: playHover } = useSound("/sfx/sfx-nav-button-play-hover.ogg");
  const { play: playClick } = useSound("/sfx/sfx-nav-button-play-click.ogg");
  const videoRef = useRef({})
  const isUserInParty = queue !== null

  useEffect(() => {
    if (actualSection !== "play" && isUserInParty && buttonState === 'disabled') {
      setButtonState('lobby')
    }
    if (actualSection !== "play" && !isUserInParty && buttonState === 'disabled') {
      setButtonState('idle')
    }
    if (actualSection === 'play' && buttonState !== 'disabled') {
      setButtonState('disabled')
      videoRef.current['disabled'].play();
    }
  }, [actualSection, isUserInParty]);
  // Texto dinámico del botón
  const getButtonText = () => {
    if (isUserInParty) return "PARTY";
    return "PLAY";
  };

  const handleClick = () => {
    if (buttonState === 'disabled') return;

    !isUserInParty && playClick();
    setButtonState('disabled');
    videoRef.current['disabled'].play();
    setSectionTabSelected('play')

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


  return (
    <div className="lol-main-button">
      <img className="container-frame" src='/play-button/play-button-frame-disabled.png'></img>
      {/* Logo circular izquierdo */}
      <video
        src='/league-logo-loop-idle.webm'
        playsInline
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
          playsInline
          autoPlay
          loop
          disablePictureInPicture
          muted
          controlsList="nodownload noplaybackrate noremoteplayback"
          src='/play-button/play-button-hover-loop.webm'
          ref={(el) => {
            videoRef.current['hover'] = el
          }}
          style={{opacity: buttonState === 'hovered' ? 1 : 0}}
        />
        <video
          className="play-button-effect-video"
          playsInline
          disablePictureInPicture
          muted
          controlsList="nodownload noplaybackrate noremoteplayback"
          src='/play-button/lobby-button-release.webm'
          ref={(el) => {
            videoRef.current['disabled'] = el
          }}
          style={{ display: buttonState === 'disabled' ? "block" : "none"}}
        />
        <span className={`main-button-text ${buttonState === 'disabled' ? 'disabled' : ''}`}>{getButtonText()}</span>
      </div>
    </div>
  );
}
