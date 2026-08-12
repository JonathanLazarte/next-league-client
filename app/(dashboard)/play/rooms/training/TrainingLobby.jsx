"use client";

import { memo } from "react";
import "./TrainingLobby.css";
import ConfirmButton from "@/components/playButton/Confirm/Confirm.jsx";
import { useDispatch } from "react-redux";
import { setUserState } from "@/redux/slices/userInterfaceSlice";

export default memo(function Explore() {
  const dispatch = useDispatch();

  return (
    <section className="explore-room">
      <div className="room-header">
        <div
          className="header-arrow"
          onClick={() => dispatch(setUserState("Online"))}
        >
          <svg
            id="Capa_2"
            data-name="Capa 2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 30 41.23"
          >
            <defs>
              <linearGradient id="active-hextech-metal-gradient" gradientTransform="rotate(90)">
                <stop offset="5%" className="stop-1" stopColor="var(--gold-one)" />
                <stop offset="95%" className="stop-2" stopColor="var(--gold-three)" />
              </linearGradient>
            </defs>
            <g className="header-arrow-border" id="Capa_1-2" data-name="Capa 1">
              <path d="M.03,20.78c-.04-.06-.03-.19,0-.25L20.36,0l9.63,9.59-10.88,11.03,10.88,11.04-9.52,9.57L.03,20.78ZM20.39,36.21l4.6-4.56-10.89-11.03,10.88-10.97-4.55-4.63-15.38,15.54,15.35,15.66Z" />
            </g>
          </svg>
        </div>
        <div className="header-queue-info">
          <img src="https://raw.githubusercontent.com/jonylazarte/resources/refs/heads/main/general/mini-sr.png" />
          <h3 className="room-title">SR · INTERMEDIATE · BLIND</h3>
        </div>
      </div>
      <ConfirmButton type={"training"} text={"INICIAR"} />
    </section>
  );
});
