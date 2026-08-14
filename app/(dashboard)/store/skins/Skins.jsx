"use client";

import { useState, useMemo, memo } from "react";
import { useSelector } from "react-redux";
import StoreSidePanel from "@/components/StoreSidePanel/StoreSidePanel";
import SkinCard from "@/components/cards/store/Skin/Skin.jsx";
import VirtualStoreGrid from "@/components/virtual-grids/VirtualStoreGrid.jsx";

import { selectUserSkinsData } from "@/redux/slices/userSkinsSlice";
import { selectUserChampionsData } from "@/redux/slices/userChampionsSlice";
import useSkins from "@/hooks/useSkins";

import "./skins.css";

export default memo(function Skins() {
  const { skinsData } = useSkins();
  const [searchKeys, setSearchKeys] = useState("");
  const [inCollection, setInCollection] = useState(false);
  const [championInCollection, setChampionInCollection] = useState(false);
  const [sortedBy, setSortedBy] = useState("");
  const [subsectionSelected, setSubsectionSelected] = useState("SKINS");

  const [categoryChecked, setCategoryChecked] = useState({
    Limited: false,
    Legendary: false,
    Ultimate: false,
  });

  const { userSkins = [] } = useSelector(selectUserSkinsData);
  const { userChampions = [] } = useSelector(selectUserChampionsData);

  // Filtro + ordenamiento
  const filteredItems = useMemo(() => {
    let result = skinsData ? [...skinsData] : [];

    result = [...result].filter((skin) => {
      const showInCollectionFilter = inCollection
        ? true // devuelve todas las skins, incluyendo las adquiridas por el usuario
        : !userSkins.find((s) => s.id === skin.id);
      const championInCollectionFilter = !championInCollection
        ? true // solo devuelve las skins relacionadas con los campeones adquiridos por el usuario
        : userChampions.find((c) => c.id === skin.champion);

      return showInCollectionFilter && championInCollectionFilter; // si un filtro esta desactivado simplemente devolverá true por lo tanto solo se evaluara el filtro activado
    });

    // Búsqueda
    if (searchKeys) {
      const query = searchKeys.toLowerCase();
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(query),
      );
    }

    // Filtros de rareza / disponibilidad limitada
    const activeFilters = Object.keys(categoryChecked).filter(
      // se detectan los filtros de rareza con checkbox marcados
      (key) => categoryChecked[key],
    );

    if (activeFilters.length > 0) {
      // se aplican los filtros segun los filtros de rareza activados
      result = result.filter((item) => {
        return activeFilters.every((filter) => {
          if (filter === "Limited") {
            return item.availability === "Limited";
          }
          return item.rarity === filter;
        });
      });
    } else {
      // Si no está marcado "Limited", ocultar los de disponibilidad limitada
      result = result.filter(
        (item) =>
          item.availability !== "Limited" &&
          item.value !== "Special" &&
          item.value !== "Battle Pass" &&
          item.value !== "Sanctum",
      );
    }

    // Ordenamiento
    if (sortedBy) {
      result.sort((a, b) => {
        switch (sortedBy) {
          case "PriceRpDescend":
            return Number(b.value) - Number(a.value);
          case "PriceRpAscend":
            return Number(a.value) - Number(b.value);
          case "alphabetically descend":
            return a.name.localeCompare(b.name);
          case "alphabetically ascend":
            return b.name.localeCompare(a.name);
          case "ReleaseAscend":
            return 0; // ya vienen ordenados por defecto (más nuevos primero)
          default:
            return 0;
        }
      });
    }

    return result /*.slice(0, 2000)*/;
  }, [
    skinsData,
    searchKeys,
    inCollection,
    championInCollection,
    categoryChecked,
    sortedBy,
    userSkins,
    userChampions,
  ]);

  const toggleCheckbox = (rarity) => {
    setCategoryChecked((prev) => ({
      ...prev,
      [rarity]: !prev[rarity],
    }));
  };

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
        searchKeys={searchKeys}
        setSearchKeys={setSearchKeys}
        inCollection={inCollection}
        setInCollection={setInCollection}
        sortedBy={sortedBy}
        setSortedBy={setSortedBy}
        itemCategoryChecked={categoryChecked}
        setItemCategoryChecked={setCategoryChecked}
        sortOptions={sortOptions}
        championInCollection={championInCollection}
        setChampionInCollection={setChampionInCollection}
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
