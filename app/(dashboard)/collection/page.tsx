"use client";

import "./collection.css";
import { useState, memo } from "react";
import { useSound } from "@/hooks/useSound";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading/Loading";
import ChampionsSection from './champions/Champions'
import { Section } from "@/types/ui";
const SkinsSection = dynamic(
  () => import("./skins/Skins"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

export default memo(function Collection() {
  const [actualSubSection, setActualSubSection] = useState("campeones");
  const subSections = [
    "campeones",
    "aspectos",
  ] as const;
  const { play } = useSound("/sfx/menu-click.mp3");
  type SubSections = typeof subSections[number]

  const handleClick = (section: SubSections) => {
    play();
    setActualSubSection(section);
  }

  return (
    <section className="collection">
      <header className="collection-header">
        {subSections.map((section: SubSections) => (
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
