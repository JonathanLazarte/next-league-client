"use client";

import "./FindMatch.css";
import { useState } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useUserInterface } from "@/hooks/useUserInterface";
import { useSound } from "@/hooks/useSound.js";

export default function FindMatchButton({
  setRoomId,
  socket,
  queueStatus
}) {
  const { updateQueue, updateQueueStatus } = useUserInterface();
  const { push } = useRouter()
  const inQueue = queueStatus !== 'idle'
  /*const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);*/

  const { play: playHover } = useSound("/sfx/sfx-lobby-button-find-match-hover.ogg");
  const { play: playClick } = useSound("/sfx/sfx-lobby-button-find-match-click.ogg");
  const { play: playQuitClick } = useSound(
    "/sfx/sfx-lobby-button-quit-click.ogg",
  );
  const { play: playQuitHover } = useSound(
    "/sfx/sfx-lobby-button-quit-hover.ogg",
  );
  const [buttonState, setButtonState] = useState('idle')

  // Contador solo cuando está en cola
  /*useEffect(() => {
    if (!inQueue) {
      setSeconds(0);
      setMinutes(0);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => (prev >= 59 ? 0 : prev + 1));
      if (seconds >= 59) {
        setMinutes((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [inQueue, seconds]);*/

  // Cancelar / Salir
  const handleCancel = () => {
    playQuitClick();

    if (queueStatus === 'idle') { push("league"); updateQueue(null) }
    else {
      socket?.current?.emit("leave-room");
      setRoomId?.(null);
      updateQueueStatus("idle");
      setButtonState("idle")
    }

  };

  // Acción principal del botón
  const handleClick = () => {
    updateQueueStatus('searching');
    playClick();
    setButtonState('disabled')
    socket?.current?.emit("find-opponent");
  };
  const handleMouseEnter = () => {
    if (buttonState === 'disabled') return;
    playHover();
    setButtonState("hovered");
  }
  const handleMouseLeave = () => {
    if (buttonState === 'disabled') return
    setButtonState("idle")
  }
  //const timing = String(minutes).padStart(1, "0") + String(seconds).padStart(2, "0")

  const displayText = inQueue
    ? `In Queue`
    : 'FIND MATCH';



  return (
    <div className={`find-match-button-wrapper ${inQueue ? "in-queue" : null}`}>
      {/* Botón de cancelar/salir */}
      <div className="find-match-out-button-border">
        <div
          translate="no"
          onClick={handleCancel}
          onMouseEnter={() => playQuitHover()}
          className="find-match-out-button"
        >
          <svg style={{ pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.7143 4L4.00001 5.71429L8.28573 10L4 14.2858L5.71429 16L10 11.7143L14.2857 16L16 14.2857L11.7143 10L16 5.7143L14.2857 4.00001L10 8.28573L5.7143 4Z" />
          </svg>
        </div>
      </div>
      <div className="find-match-button-text">{displayText}</div>
      {/* Botón principal */}
      <div className="find-match-button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
        <img
          src='/find-match-button/button-find-match.png'
          className="find-match-button-image"
          style={{ opacity: buttonState === 'idle' ? 1 : 0 }}
        />
        <img
          src='/find-match-button/button-find-match-disabled.png'
          className="find-match-button-image"
          style={{ opacity: buttonState === 'disabled' || inQueue ? 1 : 0 }}
        />
        <img
          src='/find-match-button/button-find-match-down.png'
          className="find-match-button-image"
          style={{ opacity: buttonState === 'pressed' ? 1 : 0 }}
        />
        <img
          src='/find-match-button/button-find-match-over.png'
          className="find-match-button-image"
          style={{ opacity: buttonState === 'hovered' ? 1 : 0 }}
        />
        <video
          className="find-match-button-animation"
          src="/find-match-button/find-match-button-idle.webm"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          style={{ display: inQueue ? 'none' : 'block' }}
        >
        </video>
      </div>
      <img className="footer-wing left" src='/find-match-button/footer-wing.png'></img>
      <img className="footer-wing right" src='/find-match-button/footer-wing.png'></img>
    </div>
  );
}
