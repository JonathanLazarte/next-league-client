"use client";

import "./champions.css";
import { useState, memo } from "react";

import ChampionCard from "@/components/cards/store/Champion/Champion";
import VirtualStoreGrid from "@/components/virtual-grids/VirtualStoreGrid";
import StoreSidePanel from "@/components/StoreSidePanel/StoreSidePanel";
import { STORE_SORT_OPTIONS } from "@/utils/constants";
import { useUserChampions } from '@/hooks/useUserChampions'
import useChampions from "@/hooks/useChampions";
import useFilterLogic from './useFilterLogic'

export default memo(function Champions() {
  const [subsectionSelected, setSubsectionSelected] = useState("CHAMPIONS");

  const { userChampions } = useUserChampions();
  const { championsData } = useChampions();

  const [categoryChecked, setCategoryChecked] = useState<Record<string, any>>({
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
    items: championsData || [],
    itemCategoryChecked: categoryChecked,
    adquiredItems: userChampions,
  })


  const subsections = ["CHAMPIONS", "ETERNALS", "PACKS"];


  return (
    <div className="champion-store" style={{paddingLeft: "4.4rem", paddingTop:"5.6rem"}}>

      <StoreSidePanel
        subsections={subsections}
        subsectionSelected={subsectionSelected}
        setSubsectionSelected={setSubsectionSelected}
        searchKeys={filters.searchKeys}
        setSearchKeys={filters.setSearchKeys}
        inCollection={filters.inCollection}
        setInCollection={filters.setInCollection}
        sortedBy={filters.sortedBy}
        sortOptions={STORE_SORT_OPTIONS}
        setSortedBy={filters.setSortedBy}
        itemCategoryChecked={categoryChecked}
        setItemCategoryChecked={setCategoryChecked}
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
