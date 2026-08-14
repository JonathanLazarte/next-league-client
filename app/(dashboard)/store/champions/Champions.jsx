"use client";

import "./champions.css";
import { useState, memo } from "react";
import { useSelector } from "react-redux";

import ChampionCard from "@/components/cards/store/Champion/Champion.jsx";
import VirtualStoreGrid from "@/components/virtual-grids/VirtualStoreGrid.jsx";
import StoreSidePanel from "@/components/StoreSidePanel/StoreSidePanel";
import { selectUserChampionsData } from "@/redux/slices/userChampionsSlice";

import useChampions from "@/hooks/useChampions";
import useFilterLogic from './useFilterLogic'

export default memo(function Champions() {
  const [subsectionSelected, setSubsectionSelected] = useState("CHAMPIONS");

  const { userChampions/*, loading*/ } = useSelector(selectUserChampionsData);
  const { championsData } = useChampions();
  const itemCategories = [
    "Assassin",
    "Marksman",
    "Fighter",
    "Tank",
    "Support",
    "Mage",
  ];
  const [itemCategoryChecked, setItemCategoryChecked] = useState({
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
    itemCategoryChecked: itemCategoryChecked,
    adquiredItems: userChampions,
  })



  const subsections = ["CHAMPIONS", "ETERNALS", "PACKS"];




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
        itemCategories={itemCategories}
        itemCategoryChecked={itemCategoryChecked}
        setItemCategoryChecked={setItemCategoryChecked}
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
