"use client";

import "./championsStore.css";
import { useState, useEffect, memo, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";

import ChampionStoreCard from "@/components/cards/ChampionStore/ChampionStore.jsx";
import VirtualStoreGrid from "@/components/VirtualGrid/VirtualStoreGrid.jsx";

import { selectUserChampionsData } from "@/redux/slices/userChampionsSlice.js";
import UseNearScreen from "@/services/UseNearScreen.js";
import CustomSelect from "@/components/CustomSelect/CustomSelect.jsx";
import useChampions from "@/hooks/useChampions";

export default memo(function PokemonShop() {
  const [searchKeys, setSearchKeys] = useState("");
  const [inCollection, setInCollection] = useState(false);
  const { championsData /* , isLoadingChampions*/ } = useChampions();
  const [sortedBy, setSortedBy] = useState("");
  const [sectionSelected, setSectionSelected] = useState("CAMPEONES");
  const [championCategory, setChampionCategory] = useState({
    Assassin: false,
    Fighter: false,
    Mage: false,
    Tank: false,
    Marksman: false,
    Support: false,
  });

  const { userChampions, loading } = useSelector(selectUserChampionsData);
  const externalRef = useRef();
  const { isNearScreen } = UseNearScreen({
    externalRef: loading ? null : externalRef,
    once: false,
  });

  const sections = ["CAMPEONES", "ETERNOS", "PAQUETES"];
  const championCategories = [
    "Assassin",
    "Marksman",
    "Fighter",
    "Tank",
    "Support",
    "Mage",
  ];

  // Infinite scroll
  useEffect(() => {
    if (isNearScreen) {
      setPage((prev) => prev + 1);
    }
  }, [isNearScreen]);

  const [, setPage] = useState(0);

  // Filtro y ordenamiento
  const championsFiltered = useMemo(() => {
    const activeRoles = Object.keys(championCategory).filter(
      (role) => championCategory[role],
    );

    let result = championsData?.filter((champion) => {
      const matchesSearch = searchKeys
        ? champion.name.toLowerCase().startsWith(searchKeys.toLowerCase())
        : true;

      const matchesRole =
        activeRoles.length > 0
          ? activeRoles.some((role) => champion.tags.includes(role))
          : true;

      const notInCollection = inCollection
        ? true
        : !userChampions.some((uc) => uc.id === champion.id);

      return matchesSearch && matchesRole && notInCollection;
    });

    // Ordenamiento
    if (sortedBy === "AlphabeticallyDescend") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortedBy === "AlphabeticallyAscend") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }
    if (sortedBy === "PriceRpDescend") {
      result.sort((a, b) => parseFloat(b.price.rp) - parseFloat(a.price.rp));
    }
    if (sortedBy === "PriceRpAscend") {
      result.sort((a, b) => parseFloat(a.price.rp) - parseFloat(b.price.rp));
    }
    if (sortedBy === "PriceBeDescend") {
      result.sort((a, b) => parseFloat(b.price.be) - parseFloat(a.price.be));
    }
    if (sortedBy === "PriceBeAscend") {
      result.sort((a, b) => parseFloat(a.price.be) - parseFloat(b.price.be));
    }
    if (sortedBy === "ReleaseAscend") {
      result = result.reverse();
    }

    return result;
  }, [
    championsData,
    searchKeys,
    championCategory,
    inCollection,
    sortedBy,
    userChampions,
  ]);

  const handleCheckboxChange = (role) => {
    setChampionCategory((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  return (
    <div className="champion-store">
      {/* Desktop Filters */}
      <div className="filter-nav">
        <section className="nav-section first">
          {sections.map((section) => (
            <div
              key={section}
              onClick={() => setSectionSelected(section)}
              className="checkbox section"
            >
              <div className="custom-checkbox-romb">
                {sectionSelected === section && (
                  <div className="check-element" />
                )}
              </div>
              <div
                className={
                  sectionSelected === section ? "section-selected" : ""
                }
              >
                {section}
              </div>
            </div>
          ))}
        </section>

        <section className="nav-section">
          <div className="search-filter">
            <FaSearch className="search-icon" />
            <input
              placeholder="Buscar"
              type="search"
              value={searchKeys}
              onChange={(e) => setSearchKeys(e.target.value)}
            />
          </div>
          <div
            onClick={() => setInCollection((prev) => !prev)}
            className="checkbox collection"
          >
            <div className="custom-checkbox">
              {inCollection && <FaCheck className="check-icon" />}
            </div>
            Mostrar en colección
          </div>
        </section>

        <section className="nav-section">
          <CustomSelect
            className="select-filter"
            options={[
              { value: "", label: "Lanzamiento (descendente)" },
              { value: "ReleaseAscend", label: "Lanzamiento (ascendente)" },
              { value: "PriceRpDescend", label: "Precio (RP) (descendente)" },
              { value: "PriceRpAscend", label: "Precio (RP) (ascendente)" },
              { value: "PriceBeDescend", label: "Precio (EA) (descendente)" },
              { value: "PriceBeAscend", label: "Precio (EA) (ascendente)" },
              { value: "AlphabeticallyDescend", label: "Alfabético (A-Z)" },
              { value: "AlphabeticallyAscend", label: "Alfabético (Z-A)" },
            ]}
            value={sortedBy}
            onChange={setSortedBy}
          />

          {championCategories.map((cat) => (
            <div
              key={cat}
              className="checkbox"
              onClick={() => handleCheckboxChange(cat)}
            >
              <div className="custom-checkbox">
                {championCategory[cat] && <FaCheck className="check-icon" />}
              </div>
              {cat}
            </div>
          ))}
        </section>

        <section className="nav-section last">
          <div className="checkbox">
            <div className="custom-checkbox" />
            En oferta
          </div>
        </section>
      </div>

      <div className="gradient-layer" />
      {sectionSelected === "CAMPEONES" ? (
        <VirtualStoreGrid
          items={championsFiltered}
          handleClick={() => {}}
          StoreCard={ChampionStoreCard}
        />
      ) : (
        <div className="text-red-800">Próximamente...</div>
      )}
    </div>
  );
});
