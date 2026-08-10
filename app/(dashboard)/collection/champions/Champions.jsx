"use client";

import "./champions.css";
import { useState, memo, useMemo, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUserChampionsData } from "@/redux/slices/userChampionsSlice";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Tooltip from "@/components/Tooltip/Tooltip.jsx";
import ChampionDetailModal from "@/components/ChampionDetailModal/ChampionDetailModal.jsx";
import CustomSelect from "@/components/CustomSelect/CustomSelect.jsx";
import useHoverIntent from "@/hooks/useHoverIntent.js";
import VirtualChampionsGrid from "@/components/VirtualGrid/VirtualChampionsGrid.jsx";
import useChampions from "@/hooks/useChampions";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { HOVER_DELAYS } from "@/utils/constants.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchChampionsFull = async () => {
  const res = await fetch(`${API_URL}api/v1/data/champion-full`);
  return res.json();
};

export default memo(function MainPage() {
  //const toggleMenu = () => document.body.classList.toggle("open");
  const [searchKeys, setSearchKeys] = useState();
  const searchKeysWithDelay = useDebounce(searchKeys, 50);
  /*const [skins, setSkins] = useState([])*/
  const [inCollection, setInCollection] = useState(true);
  const [sortedBy, setSortedBy] = useState("");
  const [groupedBy, setGroupedBy] = useState("");
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [hoveredChampion, setHoveredChampion] = useState(null);
  const tooltipRef = useRef();
  const tooltipPosRef = useRef({ x: 0, y: 0, rect: null });
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeChampionRef, setActiveChampionRef] = useState(null);
  const { start, cancel, end, currentDelayType } = useHoverIntent({
    initialDelay: HOVER_DELAYS.INITIAL,
    fastDelay: HOVER_DELAYS.FAST,
    resetAfter: HOVER_DELAYS.RESET_AFTER,
  });
  const { loading, userChampions } = useSelector(selectUserChampionsData);
  const { championsData, isLoadingChampionsData } = useChampions();

  const { data: championFull /*, isLoadingFullChampionsData*/ } = useQuery({
    queryKey: ["champion-full"],
    queryFn: fetchChampionsFull,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const handleScroll = () => {
    if (hoveredChampion) setHoveredChampion(null);
  };

  const onHoverStart = (champion, championCardRef) => {
    start({
      cb: () => {
        setActiveChampionRef(championCardRef);
        setTooltipPos(tooltipPosRef.current);
        setHoveredChampion(champion);
      },
      isTooltipOpened: hoveredChampion !== null,
    });
  };
  const onHoverEnd = useCallback(() => {
    end(() => setHoveredChampion(null));
    cancel();
    /*probar pasar sethoveredchampion por prop en cancel()*/
  }, [cancel, end]);

  const handleChampionClick = (champion) => {
    cancel();
    setHoveredChampion(null);
    setSelectedChampion(championFull[champion.id]);
  };

  const groupChamps = (champs, allChamps) => {
    const byRole = champs?.reduce((acumulador, campeon) => {
      if (!acumulador[campeon.tags[0]]) {
        acumulador[campeon.tags[0]] = [];
      }
      acumulador[campeon.tags[0]].push(campeon);
      return acumulador;
    }, {});
    var byPossession = {
      "En colección": [],
      "No adquiridos": [],
    };
    allChamps?.map((campeon) => {
      userChampions.some((c) => c.id === campeon.id)
        ? byPossession["En colección"].push(campeon)
        : byPossession["No adquiridos"].push(campeon);
    });

    var all = {
      Todos: champs,
    };

    switch (groupedBy) {
      case "role":
        return byRole;
      case "possession":
        return byPossession;
      default:
        return champs.length > 0 ? all : {};
    }
  };
  const filterChampions = (
    allChamps,
    searchKeysWithDelay,
    inCollection /*, sortedBy, groupedBy, page*/,
  ) => {
    var championsFiltered = allChamps?.filter((champ) => {
      const inCollectionFilter = inCollection
        ? userChampions.some((uc) => uc.id == champ.id)
        : true;
      const keysFilter = searchKeysWithDelay
        ? champ.name.toLowerCase().startsWith(searchKeys.toLowerCase())
        : true;

      return inCollectionFilter && keysFilter;
    });
    championsFiltered = groupChamps(championsFiltered, allChamps);
    /*if(sortedBy === "alphabetically descend"){
            sectionFiltered.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameA.localeCompare(nameB);
        }) }
        if(sortedBy === "alphabetically ascend"){
            sectionFiltered.sort((a, b) => {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            return nameB.localeCompare(nameA);
        }) }*/
    return championsFiltered;
  };

  const handleCloseModal = () => {
    setSelectedChampion(null);
  };

  /*const LoadPokemon = () => {
        return renderData?.map((c, index) => (
            <Card
                key={c.id || index} // Usar poke.id si está disponible, de lo contrario, index
                id={index}
                data={c}
            />
        ));
    };*/

  const groupedChampions = useMemo(() => {
    if (!championsData) return {};
    let result = filterChampions(
      championsData,
      searchKeysWithDelay,
      inCollection,
      sortedBy,
      groupedBy,
    );
    return result;
  }, [championsData, searchKeysWithDelay, inCollection, sortedBy, groupedBy]);


  return (
    <div className="collection-champions-wrapper">
      <div
        className="collection-champions-content"
        style={{ pointerEvents: `${selectedChampion ? "none" : "unset"}` }}
      >
        <div className="filter-nav">
          <div className="left-place">
            <div className="square-hextech">
              <img className="square-hextech-frame top" src="/collection/square-hextech-frame-top.png"></img>
              <img className="square-hextech-frame bot" src="/collection/square-hextech-frame-bot.png"></img>
              <div className="maestry-etern-levels">
                <div className="amount-and-description">
                  <div className="amount">0</div>
                  <div className="description">TOTAL MASTERY LEVEL</div>
                </div>
                <div className="amount-and-description">
                  <div className="amount">0</div>
                  <div className="description">ETERNALS MILESTONES</div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-place">
            <div className="search-filter">
              <FaSearch className="search-icon" />
              <input
                placeholder="Search"
                type="search"
                onKeyUp={(event) => setSearchKeys(event.currentTarget.value)}
              ></input>
            </div>

            {groupedBy != "possession" ? (
              <div
                className="checkbox"
                onClick={() => setInCollection((prevState) => !prevState)}
              >
                <div className="custom-checkbox" type="checkbox">
                  {!inCollection ? <FaCheck className="check-icon" /> : null}
                </div>
                Show Unowned
              </div>
            ) : (
              <div style={{ height: "5.4rem" }} className="h-3"></div>
            )}

            <CustomSelect
              className="select-filter"
              options={[
                { value: "", label: "All Champions" },
                { value: "possession", label: "Most Popular Posesition" },
                { value: "role", label: "Role" },
              ]}
              value={groupedBy}
              onChange={setGroupedBy}
              placeholder="Select Grouping..."
            />

            <CustomSelect
              className="select-filter"
              options={[
                { value: "alphabetically", label: "Alphabetical" },
                { value: "championsMastery", label: "Champion Mastery" },
              ]}
              value={sortedBy}
              onChange={setSortedBy}
              placeholder="Select Sorting..."
            />
          </div>
        </div>
        {Object.keys(groupedChampions).length > 0 ? (
          <VirtualChampionsGrid
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            tooltipPosRef={tooltipPosRef}
            groupedChampions={groupedChampions}
            handleChampionClick={handleChampionClick}
            userChampions={userChampions}
            tooltipRef={tooltipRef}
            handleScroll={handleScroll}
          />
        ) : (
          <></>
        )}
        {!loading &&
          !isLoadingChampionsData &&
          championsData &&
          Object.keys(groupedChampions).length == 0 ? (
          <span className="apologize-message">
            We are sorry, no collectible matches your search criteria
          </span>
        ) : null}
      </div>

      {/* Champion Detail Modal */}
      {selectedChampion ? (
        <ChampionDetailModal
          champion={selectedChampion}
          onClose={handleCloseModal}
        />
      ) : null}
      {!selectedChampion && hoveredChampion ? (
        <Tooltip
          currentDelayType={currentDelayType}
          content={{
            championName: hoveredChampion?.name || null,
            masteryLevel: 1,
            masteryPoints: 0,
            maxSeasonRating: "N/D",
            startInfo: "A",
            eternals: ["Serie 1", "Serie 2", "Serie Inicial"],
            freeToPlay: false,
          }}
          position="right"
          ref={tooltipRef}
          tooltipPos={tooltipPos}
          hoveredChampion={hoveredChampion}
          activeChampionRef={activeChampionRef}
        />
      ) : null}
    </div>
  );
});
