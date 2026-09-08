"use client";

import { useState, memo } from "react";
import StoreSidePanel from "@/components/StoreSidePanel/StoreSidePanel";
import SkinCard from "@/components/cards/store/Skin/Skin";
import VirtualStoreGrid from "@/components/virtual-grids/VirtualStoreGrid";
import useSkins from "@/hooks/useSkins";
import { useUserChampions } from '@/hooks/useUserChampions'
import { useUserSkins } from '@/hooks/useUserSkins'
import { useFilterLogic } from './useFilterLogic'

import "./skins.css";

export default memo(function Skins() {
  const { skinsData } = useSkins();
  const { userSkins = [] } = useUserSkins();
  const { userChampions } = useUserChampions();
  const [subsectionSelected, setSubsectionSelected] = useState("SKINS");
  const [categoryChecked, setCategoryChecked] = useState({
    Limited: false,
    Legendary: false,
    Ultimate: false,
  });



  const {
    filteredItems,
    filters
  } = useFilterLogic({
    items: skinsData,
    ownedItems: userSkins,
    ownedChampions: userChampions,
    categoryChecked,
    setCategoryChecked
  })

  const subsections = ["SKINS", "CHROMAS", "PACKS"];

  const sortOptions = [
    { value: "", label: "Release Date ↓" },
    { value: "ReleaseAscend", label: "Release Date ↑" },
    { value: "PriceRpDescend", label: "Price (RP) ↓" },
    { value: "PriceRpAscend", label: "Price (RP) ↑" },
    { value: "alphabetically descend", label: "Alphabetical A-Z" },
    { value: "alphabetically ascend", label: "Alphabetical Z-A" },
  ];

  return (
    <div className="skins-store">
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
        itemCategoryChecked={filters.categoryChecked}
        setItemCategoryChecked={filters.setCategoryChecked}
        sortOptions={sortOptions}
        championInCollection={filters.championInCollection}
        setChampionInCollection={filters.setChampionInCollection}
      />
      <div className="gradient-layer" />
      {/* Grid de skins */}
      {subsectionSelected === "SKINS" ? (
        <VirtualStoreGrid items={filteredItems} StoreCard={SkinCard} />
      ) : (
        <div className="poro-apologizes flex justify-center items-center grow">
          <img src="/global/poro_question.png" alt="Poro question"></img>
        </div>
      )}
    </div>
  );
});
