"use client";

import "./collection.css";
import { useState, memo } from "react";
import { useSound } from "@/hooks/useSound.js";
import dynamic from "next/dynamic";
const ChampionsSection = dynamic(
  () => import("./collectionChampions/collectionChampions.jsx"),
);
const SkinsSection = dynamic(
  () => import("./collectionSkins/collectionSkins.jsx"),
);

export default memo(function Bag() {
  const [actualSection, setLocalSection] = useState("campeones");
  const sections = [
    "campeones",
    "aspectos",
    "gestos",
    "runas",
    "hechizos",
    "objetos",
    "íconos",
    "centinelas",
    "chromas",
    "remates",
  ];
  const { play } = useSound("/general/menu-click.mp3");

  return (
    <section className="collection">
      <header className="collection-header">
        {sections.map((section) => (
          <div
            key={section}
            className={`collection-tab ${actualSection === section ? "active-collection-tab" : null}`}
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
