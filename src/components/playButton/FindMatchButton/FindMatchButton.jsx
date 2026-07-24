"use client";

import "./FindMatchButton.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUserState } from "@/redux/slices/userInterfaceSlice.js";
import { useSound } from "@/hooks/useSound.js";
import { HiOutlineX } from "react-icons/hi";

export default function FindMatchButton({
  setRoomId,
  socket,
  type,
  text,
  queueSelected,
  okButtonAction,
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [inQueue, setInQueue] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const { play: playHover } = useSound("/general/find-match-button-hover.mp3");
  const { play: playClick } = useSound("/general/find-match-button-click.mp3");
  const { play: playCancel } = useSound(
    "/general/confirm-button-cancel-click.mp3",
  );
  const { play: playConfirm } = useSound("/general/confirm-button-click.mp3");

  // Contador solo cuando está en cola
  useEffect(() => {
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
  }, [inQueue, seconds]);

  // Cancelar / Salir
  const handleCancel = () => {
    playCancel();

    if (type === "pvp-room") {
      socket?.current?.emit("leave-room");
      setRoomId?.(null);
      dispatch(setUserState("Online"));
      router.push("league");
    }

    if (type === "training" || type === "modeSelection") {
      dispatch(setUserState("Online"));
      router.push("league");
    }

    setInQueue(false);
  };

  // Acción principal del botón
  const handleConfirm = () => {
    if (type === "pvp-room") {
      playClick();
      socket?.current?.emit("find-opponent");
      setInQueue(true);
    }
    if (type === "modeSelection") {
      playConfirm();
      dispatch(setUserState(queueSelected));
    }

    if (type === "arenaPokemonSelection") {
      okButtonAction?.();
    }
  };

  const displayText = inQueue
    ? `In Queue: ${String(minutes).padStart(1, "0")}:${String(seconds).padStart(2, "0")}`
    : text;

  return (
    <div className={`find-match-button-wrapper ${inQueue ? "in-queue" : null}`}>
      {/* Botón de cancelar/salir */}
      <div className="find-match-out-button-border">
        <div
          translate="no"
          onClick={handleCancel}
          className="find-match-out-button"
        >
          <HiOutlineX />
        </div>
      </div>

      {/* Botón principal */}
      <div className="find-match-button-text">{displayText}</div>
      {/*<svg width="0" height="0" style={{position: 'absolute'}}>
  <defs>
    <clipPath id="lol-btn-shape" clipPathUnits="objectBoundingBox">
    <g>
      <path class="cls-1" d="M230.88,41.69c-73.12,20.49-153.65,20.69-226.62-.35L23.25,3.02c.45.22,188.37-.44,188.68.22l18.94,38.45Z"/>
      <path d="M22.88,2.47l189.14-.03,19.53,39.67-.32.23c-44.3,12.77-91.08,17.05-137.12,14.59-28.87-1.54-58.58-5.79-86.36-13.7-1.1-.31-2.94-.68-3.89-1.11-.15-.07-.34-.12-.39-.29L22.88,2.47ZM230.88,41.79L211.93,3.33l-.45-.22H23.25S4.26,41.44,4.26,41.44c.04.19,1.57.59,1.89.68,7.97,2.48,16.67,4.4,24.85,6.11,51.38,10.73,106.6,11.59,158.39,2.97,14-2.33,27.89-5.42,41.49-9.43Z"/>
      <path class="cls-1" d="M0,43.44L21.15.09c19.6.14,39.22.09,58.83.09,33.66,0,67.49,0,101.13,0,10.34,0,20.7.03,30.97-.14.6,0,1.61-.2,1.94.36l20.97,43.12c0,.16-2.13.81-2.46.91-8.29,2.66-17.14,4.81-25.66,6.66-40.86,8.86-84.68,11.22-126.36,7.64-27.28-2.35-54.36-7.39-80.52-15.28ZM22.81,2.5L3.39,41.87c.05.18.25.23.39.29.95.43,2.8.8,3.89,1.11,27.78,7.9,57.49,12.15,86.36,13.7,46.04,2.46,92.82-1.82,137.12-14.59l.32-.23L211.95,2.47l-189.14.03Z"/>
    </g>
    </clipPath>
  </defs>
</svg>*/}
      <svg
        className="find-match-button"
        id="Capa_2"
        data-name="Capa 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1737.98 446.15"
        onMouseEnter={() => playHover()}
        onClick={handleConfirm}
      >
        <defs>
          <pattern
            id="hextech-bg"
            patternUnits="userSpaceOnUse"
            width="1900"
            height="570"
          >
            <image
              x="-60"
              href="/find-match-button-background.png"
              width="1900"
              height="570"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
          <linearGradient id="findMatchGradient" gradientTransform="rotate(90)">
            <stop offset="5%" className="stop-1" stop-color="#19838f" />
            <stop offset="95%" className="stop-2" stop-color="#0cb0d9" />
          </linearGradient>
          <linearGradient id="hoverGradient" gradientTransform="rotate(90)">
            <stop offset="5%" stop-color="#8abccc" />
            <stop offset="95%" stop-color="#12a9bf" />
          </linearGradient>
          <filter id="gold-glow">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            {/* 1. Engrosamos la línea un poco */}
            <feMorphology
              operator="dilate"
              radius="2"
              in="SourceAlpha"
              result="thicken"
            />
            {/* 2. Desenfocamos ese grosor */}
            <feGaussianBlur in="thicken" stdDeviation="10" result="blurred" />
            {/* 3. Le damos color al brillo (dorado) */}
            <feFlood floodColor="#C8AA6E" result="glowColor" />
            <feComposite
              in="glowColor"
              in2="blurred"
              operator="in"
              result="softGlow_colored"
            />
            {/* 4. Ponemos el borde original encima del brillo */}
            <feMerge>
              <feMergeNode in="softGlow_colored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="shine-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />

            {/* Animación del gradiente: se mueve de -100% a 100% */}
            <animate
              attributeName="x1"
              from="-100%"
              to="100%"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="0%"
              to="200%"
              dur="3s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Máscara para que el brillo no se salga de la forma del botón */}
          <mask id="btn-mask">
            <path
              d="M0,321.28L156.45.68c144.92,1.04,290.09.68,435.1.66,248.96-.05,499.15.06,747.91,0,76.48-.02,153.12.18,229.06-1.04,4.46-.07,11.91-1.5,14.35,2.63l155.11,318.87c-.07,1.15-15.78,5.98-18.21,6.76-61.28,19.68-126.79,35.6-189.75,49.25-302.19,65.51-626.23,82.99-934.51,56.48C393.72,416.93,193.47,379.65,0,321.28ZM168.69,18.48L25.09,309.63c.37,1.3,1.84,1.67,2.92,2.16,7.05,3.17,20.68,5.91,28.78,8.22,205.47,58.45,425.16,89.89,638.71,101.29,340.51,18.19,686.46-13.47,1014.08-107.94l2.35-1.71L1567.51,18.28l-1398.81.2Z"
              fill="white"
            />{" "}
            {/* El path de la silueta */}
          </mask>
        </defs>
        <g id="Capa_1-2" data-name="Capa 1">
          <path
            className="find-match-button-vector-background"
            d="M1707.48,308.35c-540.73,151.57-1136.37,152.99-1675.97-2.55L171.98,22.36c3.36,1.65,1393.09-3.23,1395.4,1.6l140.1,284.38Z"
          />
          <path d="M169.18,18.24l1398.81-.2,144.42,293.36-2.35,1.71c-327.62,94.47-673.57,126.13-1014.08,107.94-213.55-11.41-433.23-42.85-638.71-101.29-8.11-2.31-21.73-5.05-28.78-8.22-1.08-.49-2.55-.86-2.92-2.16L169.18,18.24ZM1707.48,309.03L1567.38,24.65l-3.34-1.66-1392.06.06L31.52,306.48c.32,1.41,11.63,4.33,13.97,5.06,58.95,18.38,123.25,32.54,183.81,45.19,380.02,79.38,788.41,85.75,1171.38,22,103.51-17.23,206.28-40.08,306.81-69.7Z" />
          <path
            className="find-match-button-vector-border"
            d="M0,321.28L156.45.68c144.92,1.04,290.09.68,435.1.66,248.96-.05,499.15.06,747.91,0,76.48-.02,153.12.18,229.06-1.04,4.46-.07,11.91-1.5,14.35,2.63l155.11,318.87c-.07,1.15-15.78,5.98-18.21,6.76-61.28,19.68-126.79,35.6-189.75,49.25-302.19,65.51-626.23,82.99-934.51,56.48C393.72,416.93,193.47,379.65,0,321.28ZM168.69,18.48L25.09,309.63c.37,1.3,1.84,1.67,2.92,2.16,7.05,3.17,20.68,5.91,28.78,8.22,205.47,58.45,425.16,89.89,638.71,101.29,340.51,18.19,686.46-13.47,1014.08-107.94l2.35-1.71L1567.51,18.28l-1398.81.2Z"
          />
        </g>
        {/*<text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
          fill="#caf8f8" font-family="Bold" font-weight="bold" font-size="135">
      FIND MATCH
    </text>*/}
        <rect
          width="100%"
          height="100%"
          fill="url(#shine-grad)"
          mask="url(#btn-mask)"
          className="pointer-events-none therect"
        />
      </svg>
      <svg
        className="find-match-button-decorations"
        id="Capa_2"
        data-name="Capa 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1243.8 124.7"
      >
        <defs></defs>
        <g id="Capa_2-2" data-name="Capa 2">
          <path
            className="decoration"
            d="M1243.8,3.94c-20.54-.2-41.09-.22-61.63-.49-77.95-1.02-156.44-.96-234.35-3.08-5.83-.16-15.64-.73-21.01.04-1.38.2-1.71-.56-1.5,1.51l67.67,122.78c.56-.51,1.27-.89,2.05-1.11l-54.74-113.19c8.47-.25,17.01.29,25.48.03,89.61-2.75,179.64-3.34,269.27-5.07,2.63-.05,5.27-.05,7.91-.03.18-.53.48-.99.85-1.39Z"
          />
          <path
            className="decoration"
            d="M0,3.93c20.54-.2,41.09-.22,61.63-.49,77.95-1.02,156.44-.96,234.35-3.08,5.83-.16,15.64-.73,21.01.04,1.38.2,1.71-.56,1.5,1.51l-67.67,122.78c-.56-.51-1.27-.89-2.05-1.11l54.74-113.19c-8.47-.25-17.01.29-25.48.03C188.42,7.66,98.39,7.08,8.76,5.35c-2.63-.05-5.27-.05-7.91-.03-.18-.53-.48-.99-.85-1.39Z"
          />
        </g>
      </svg>
    </div>
  );
}
