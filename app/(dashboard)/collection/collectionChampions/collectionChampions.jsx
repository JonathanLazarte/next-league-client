"use client";

import "./collectionChampions.css";
import { useState, memo, useMemo, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectUserChampionsData } from "@/redux/slices/userChampionsSlice.js";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import Tooltip from "@/components/ToolTip/ToolTip.jsx";
import ChampionDetailModal from "@/components/ChampionDetailModal/ChampionDetailModal.jsx";
import CustomSelect from "@/components/CustomSelect/CustomSelect.jsx";
import useHoverIntent from "@/hooks/useHoverIntent.js";
import VirtualChampionsGrid from "@/components/VirtualGrid/VirtualChampionsGrid.jsx";
import useChampions from "@/hooks/useChampions";
import { useQuery } from "@tanstack/react-query";
import { HOVER_DELAYS } from "@/utils/constants.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchChampionsFull = async () => {
  const res = await fetch(`${API_URL}pokemons/data/championFull`);
  return res.json();
};

export default memo(function MainPage() {
  //const toggleMenu = () => document.body.classList.toggle("open");
  const [searchKeys, setSearchKeys] = useState();
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

  const onHoverStart = (champion, championCardRef) => {
    start({
      cb: () => {
        setActiveChampionRef(championCardRef);
        setTooltipPos(tooltipPosRef.current);
        setHoveredChampion(champion);
      },
      isTooltipOpened: hoveredChampion !== null,
    });
    /*setToolTipPos({
            x: e.clientX,
            y: e.clientY
        })*/
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
      /*!acumulador['En colección'] ? acumulador['En colección'] = []
            !acumulador['No adquiridos'] ? acumulador['No adquiridos'] = []*/
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
    searchKeys,
    inCollection /*, sortedBy, groupedBy, page*/,
  ) => {
    var championsFiltered = allChamps?.filter((champ) => {
      const inCollectionFilter = inCollection
        ? userChampions.some((uc) => uc.id == champ.id)
        : true;
      const keysFilter = searchKeys
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
      searchKeys,
      inCollection,
      sortedBy,
      groupedBy,
    );
    return result;
  }, [championsData, searchKeys, inCollection, sortedBy, groupedBy]);

  /*const RenderChampsWithSections = () => {
        return Object.keys(groupedChampions)?.map((section, index) => (
            <div key={index} className={`champion-section ${Object.keys(groupedChampions).length -1 == index ? null :"border-b border-white/10" }`}>
                {section != 'Todos' ? <h1 className={`${ index === 0 ? 'mt-[0.6vh] mb-[3.2vh]' : 'mt-[2.3vh] mb-[2.3vh]'}  text-lg flex items-center content-center`}>{section.toUpperCase()}</h1> : null }
                <main>
                    {groupedChampions[section].length > 0 ? groupedChampions[section]?.map((c, index) => (
                                <Card
                                    key={c.id || index} // Usar poke.id si está disponible, de lo contrario, index
                                    id={index}
                                    champion={c}
                                    adquired={ userChampions.some(uc => uc.id == c.id) }
                                    onClick={handleChampionClick}
                                    onHoverStart={onHoverStart}
                                    onHoverEnd={onHoverEnd}
                                    toolTipPosRef={toolTipPosRef}
                                />
                    )) : null }
                </main>
            </div>
        ));
    }*/
  /*const checkboxStyle = inCollection ? {backgroundColor: "white"} : null;*/
  return (
    <div className="collection-champions-wrapper">
      <div
        className="collection-champions-content"
        style={{ pointerEvents: `${selectedChampion ? "none" : "unset"}` }}
      >
        <div className="filter-nav">
          <div className="left-place">
            <div className="maestry-etern-levels-container">
              <svg
                className="hextech-border"
                id="Capa_2"
                data-name="Capa 2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 243.62 224.22"
              >
                <g id="Containers">
                  <g>
                    <path
                      class="cls-1"
                      d="M1,7.93c4.73,0,8.56-3.1,8.56-6.93h224.49c0,3.83,3.83,6.93,8.56,6.93"
                    />
                    <path
                      class="cls-1"
                      d="M16.5,218.88c-2.22-5.21-8.31-8.95-15.5-8.95V14.57c7.19,0,13.28-3.74,15.5-8.95"
                    />
                    <path
                      class="cls-1 resalted"
                      d="M242.62,216.29c-4.73,0-8.56,3.1-8.56,6.93H9.56c0-3.83-3.83-6.93-8.56-6.93"
                    />
                    <path
                      class="cls-1"
                      d="M227.12,5.33c2.22,5.21,8.31,8.95,15.5,8.95v195.36c-7.19,0-13.28,3.74-15.5,8.95"
                    />
                  </g>
                </g>
              </svg>
              <div className="maestry-etern-levels">
                <div className="amount-and-description">
                  <div className="amount">541</div>
                  <div className="description">NIVEL TOTAL DE MAESTRIA</div>
                </div>
                <div className="amount-and-description">
                  <div className="amount">15</div>
                  <div className="description">METAS DE ETERNOS</div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-place">
            <div className="search-filter">
              <FaSearch className="search-icon" />
              <input
                placeholder="Buscar"
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
                Mostrar no obtenidos
              </div>
            ) : (
              <div style={{ height: "5.4rem" }} className="h-3"></div>
            )}

            <CustomSelect
              className="select-filter"
              options={[
                { value: "", label: "Todos los campeones" },
                { value: "possession", label: "Posesión" },
                { value: "role", label: "Rol" },
              ]}
              value={groupedBy}
              onChange={setGroupedBy}
              placeholder="Seleccionar agrupación..."
            />

            <CustomSelect
              className="select-filter"
              options={[
                { value: "alphabetically", label: "Alfabético" },
                { value: "championsMastery", label: "Maestria de campeones" },
              ]}
              value={sortedBy}
              onChange={setSortedBy}
              placeholder="Seleccionar orden..."
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
