"use client";

import "./collection.css";
import { useState, memo } from "react";
import { useSound } from "@/hooks/useSound.js";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading/Loading";
/*const ChampionsSection = dynamic(
  () => import("./collectionChampions/collectionChampions.jsx"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);*/
import ChampionsSection from './collectionChampions/collectionChampions'
const SkinsSection = dynamic(
  () => import("./collectionSkins/collectionSkins.jsx"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

export default memo(function Bag() {
  const [actualSection, setLocalSection] = useState("campeones");
  const sections = [
    "campeones",
    "aspectos",
    /*"gestos",
    "runas",
    "hechizos",
    "objetos",
    "íconos",
    "centinelas",
    "chromas",
    "remates",*/
  ];
  const { play } = useSound("/general/menu-click.mp3");

  return (
    <section className="collection">
      <header className="collection-header">
        {sections.map((section) => (
          <div
            key={section}
            className={`subheader-tab ${actualSection === section ? "active-subheader-tab" : null}`}
            onClick={() => {
              play();
              setLocalSection(section);
            }}
          >
            {section.toUpperCase()}
          </div>
        ))}
      </header>
      {actualSection == "aspectos" && <SkinsSection></SkinsSection>}
      {actualSection == "campeones" && <ChampionsSection></ChampionsSection>}
    </section>
  );
});
