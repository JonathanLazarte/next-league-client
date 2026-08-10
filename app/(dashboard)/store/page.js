"use client";

import "./store.css";
import { useState, memo } from "react";
import dynamic from "next/dynamic";
import { IoIosGift } from "react-icons/io";
import { MdOutlineManageAccounts } from "react-icons/md";
import { useSound } from "@/hooks/useSound.js";
import Loading from "@/components/Loading/Loading";
import "./champions/Champions.css";
import "./skins/Skins.css";

/*const ChampionsStore = dynamic(
  () => import("./championsStore/championsStore"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);*/
import ChampionsStore from './champions/Champions'
const SkinsStore = dynamic(() => import("./skins/Skins.jsx"), {
  loading: () => <Loading />,
  ssr: false,
});

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
