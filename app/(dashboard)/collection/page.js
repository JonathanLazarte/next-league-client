"use client";

import "./collection.css";
import { useState, memo } from "react";
import { useSound } from "@/hooks/useSound";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading/Loading";
/*const ChampionsSection = dynamic(
  () => import("./collectionChampions/collectionChampions.jsx"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);*/
import ChampionsSection from './champions/Champions'
const SkinsSection = dynamic(
  () => import("./skins/Skins"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

export default memo(function Collection() {
  const [actualSubSection, setActualSubSection] = useState("campeones");
  const sections = [
    "campeones",
    "aspectos",
  ];
  const { play } = useSound("/sfx/menu-click.mp3");

  const handleClick = (section) => {
    play();
    setActualSubSection(section);
  }

  return (
    <section className="collection">
      <header className="collection-header">
        {sections.map((section) => (
          <div
            key={section}
            className={`subheader-tab ${actualSubSection === section ? "active-subheader-tab" : null}`}
            onClick={() => handleClick(section)}
          >
            {section.toUpperCase()}
          </div>
        ))}
      </header>
      {actualSubSection == "aspectos" && <SkinsSection></SkinsSection>}
      {actualSubSection == "campeones" && <ChampionsSection></ChampionsSection>}
    </section>
  );
});
