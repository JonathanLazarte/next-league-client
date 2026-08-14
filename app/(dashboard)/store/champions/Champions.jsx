"use client";

import "./champions.css";
import { useState, memo } from "react";

import ChampionCard from "@/components/cards/store/Champion/Champion.jsx";
import VirtualStoreGrid from "@/components/virtual-grids/VirtualStoreGrid.jsx";
import StoreSidePanel from "@/components/StoreSidePanel/StoreSidePanel";

import { useUserChampions } from '@/hooks/useUserChampions'
import useChampions from "@/hooks/useChampions";
import useFilterLogic from './useFilterLogic'

export default memo(function Champions() {
  const [subsectionSelected, setSubsectionSelected] = useState("CHAMPIONS");

  const { userChampions } = useUserChampions();
  const { championsData } = useChampions();

  const [categoryChecked, setCategoryChecked] = useState({
    Assassin: false,
    Fighter: false,
    Mage: false,
    Tank: false,
    Marksman: false,
    Support: false,
  });
  const {
    filteredItems,
    filters
  } = useFilterLogic({
    items: championsData,
    itemCategoryChecked: categoryChecked,
    adquiredItems: userChampions,
  })



  const subsections = ["CHAMPIONS", "ETERNALS", "PACKS"];
  const sortOptions = [
    { value: "", label: "Release Date ↓" },
    { value: "ReleaseAscend", label: "Release Date ↑" },
    { value: "PriceRpDescend", label: "Price (RP) ↓" },
    { value: "PriceRpAscend", label: "Price (RP) ↑" },
    { value: "PriceBeDescend", label: "Price (EA) ↓" },
    { value: "PriceBeAscend", label: "Price (EA) ↑" },
    { value: "AlphabeticallyDescend", label: "Alphabetical (A-Z)" },
    { value: "AlphabeticallyAscend", label: "Alphabetical (Z-A)" },
  ]



  return (
    <div className="champion-store">
      {/* Desktop Filters */}

      <StoreSidePanel
        subsections={subsections}
        subsectionSelected={subsectionSelected}
        setSubsectionSelected={setSubsectionSelected}
        searchKeys={filters.searchKeys}
        setSearchKeys={filters.setSearchKeys}
        inCollection={filters.inCollection}
        setInCollection={filters.setInCollection}
        sortedBy={filters.sortedBy}
        setSortedBy={filters.setSortedBy}
        itemCategoryChecked={categoryChecked}
        setItemCategoryChecked={setCategoryChecked}
        sortOptions={sortOptions}
      />
      <div className="gradient-layer" />
      {subsectionSelected === "CHAMPIONS" ? (
        <VirtualStoreGrid
          items={filteredItems}
          StoreCard={ChampionCard}
        />
      ) : (
        <div className="poro-apologizes flex justify-center items-center grow">
          <img src="/global/poro_question.png" alt="Poro sad"></img>
        </div>
      )}
    </div>
  );
});
