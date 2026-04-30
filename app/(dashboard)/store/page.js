"use client";

import "./store.css";
import { useState, memo } from "react";
import dynamic from "next/dynamic";
import { IoIosGift } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useSound } from "@/hooks/useSound.js";

import ChampionsStore from "./championsStore/championsStore.jsx";
const SkinsStore = dynamic(() => import("./skinsStore/skinsStore.jsx"));

export default memo(function Store() {
  const [actualSection, setActualSection] = useState("campeones");
  const { play } = useSound("/general/menu-click.mp3");

  return (
    <section className="store">
      <header className="store-header">
        <div className="sections-items">
          <div
            className={`subheader-tab ${actualSection === "campeones" ? "active-subheader-tab" : null}`}
            onClick={() => {
              setActualSection("campeones");
              play();
            }}
          >
            CAMPEONES
          </div>
          <div
            className={`subheader-tab ${actualSection === "aspectos" ? "active-subheader-tab" : null}`}
            onClick={() => {
              setActualSection("aspectos");
              play();
            }}
          >
            ASPECTOS
          </div>
        </div>
        <div className="right-items">
          <div className="buy-rp-button">COMPRAR RP</div>
          <div className="rounded-button">
            <IoIosGift className="rounded-icon" />
          </div>
          <div className="rounded-button">
            <MdOutlineManageAccounts className="rounded-icon" />
          </div>
        </div>
      </header>

      {actualSection == "campeones" && <ChampionsStore />}
      {actualSection == "aspectos" && <SkinsStore />}
    </section>
  );
});
