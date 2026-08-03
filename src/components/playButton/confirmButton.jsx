"use client";

import "./confirmButton.css";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUserState } from "@/redux/slices/userInterfaceSlice.ts";
import { useSound } from "@/hooks/useSound.js";

export default function PlayButton({ type, activeButtonAction }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const text = "CONFIRM"

  const { play: playHover } = useSound("/sfx/sfx-gameselect-button-confirm-hover.ogg");
  const { play: playCancel } = useSound(
    "/general/confirm-button-cancel-click.mp3",
  );
  const { play: playConfirm } = useSound("/sfx/sfx-gameselect-button-confirm-click.ogg");

  // Cancelar / Salir
  const handleCancel = () => {
    playCancel();
    dispatch(setUserState("online"));
    router.push("league");
  };

  // Acción principal del botón
  const handleConfirm = () => {
    if (type === "modeSelection") {
      playConfirm();
      activeButtonAction();
    }
  };

  const displayText = text;

  return (
    <div className="confirm-and-out-button">
      {/* Botón de cancelar/salir */}
      <div className="out-button-border">
        <div translate="no" onClick={handleCancel} className="out-button">
          <svg style={{pointerEvents: 'none'}} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M5.7143 4L4.00001 5.71429L8.28573 10L4 14.2858L5.71429 16L10 11.7143L14.2857 16L16 14.2857L11.7143 10L16 5.7143L14.2857 4.00001L10 8.28573L5.7143 4Z" fill="#CDBE91"/>
          </svg>
        </div>
      </div>

      {/* Botón principal */}
      <div className="confirm-button-rect"></div>
      <svg
        className="confirm-button-vector"
        id="Capa_2"
        data-name="Capa 2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 157.94 30.55"
        onMouseEnter={() => playHover()}
        onClick={handleConfirm}
      >
        <defs>
          <linearGradient id="myGradient" gradientTransform="rotate(90)">
            <stop
              offset="5%"
              stopColor="var(--start-color1)"
            >
            </stop>
            <stop
              offset="95%"
              stopColor="var(--end-color1)"
            />
          </linearGradient>
          <linearGradient
            id="confirmButtonBorderGradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="5%" stopColor="var(--confirm-button-border-start)" />
            <stop offset="95%" stopColor="var(--confirm-button-border-end)" />
          </linearGradient>
          <linearGradient
            id="confirmBackgroundGradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="5%" stopColor="#1c272f" />
            <stop offset="95%" stopColor="#123a4d" />
          </linearGradient>
          <linearGradient
            id="confirmActiveBorderGradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="5%" stopColor="#0d3f4b" />
            <stop offset="95%" stopColor="#025679" />
          </linearGradient>
        </defs>
        <g id="Capa_2-2" data-name="Capa 2">
          <g>
            <path
              className="confirm-button-vector-background"
              d="M5.76,2.05c-.21.06-.21.27-.11.42,6.14,6.95,6.66,16.29,1.44,23.78-.29.42-1.3,1.48-1.42,1.83-.07.2.04.37.28.41h135.11c.22-.04.5-.33.66-.47,3.28-2.93,6.36-6.07,9.54-9.09.98-.93,2.23-1.91,3.14-2.87.08-.09.32-.32.33-.41.03-.16-.75-.9-.93-1.07-4.06-3.88-8.33-7.89-12.53-11.66-.22-.19-.88-.83-1.12-.87H5.75s.01,0,.01,0Z"
            />
            <path
              className="confirm-button-vector-border"
              d="M.81,30.55c6.55-5.18,9.35-12.85,6.94-20.36C6.44,6.1,3.67,2.77,0,0h141.53l16.42,15.68-15.1,14.87H.81ZM5.76,2.12c-.21.06-.21.27-.11.42,6.14,6.95,6.66,16.29,1.44,23.78-.29.42-1.3,1.48-1.42,1.83-.07.2.04.37.28.41h135.11c.22-.04.5-.33.66-.47,3.28-2.93,6.36-6.07,9.54-9.09.98-.93,2.23-1.91,3.14-2.87.08-.09.32-.32.33-.41.03-.16-.75-.9-.93-1.07-4.06-3.88-8.33-7.89-12.53-11.66-.22-.19-.88-.83-1.12-.87H5.75s.01,0,.01,0Z"
            />
          </g>
        </g>
      </svg>
      <div className="confirm-button-text">{displayText}</div>
    </div>
  );
}
