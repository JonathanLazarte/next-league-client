"use client";

import "./collectionSkins.css";
import {
  useState,
  useEffect,
  memo,
  useMemo,
  useDeferredValue,
  useRef,
  useCallback,
} from "react";
import { useSelector } from "react-redux";
import { selectUserSkinsData } from "@/redux/slices/userSkinsSlice.js";
import { FaSearch } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import SkinTooltip from "@/components/ToolTip/skinTooltip/skinTooltip.jsx";
import CustomSelect from "@/components/CustomSelect/CustomSelect.jsx";
import useHoverIntent from "@/hooks/useHoverIntent.js";
import { RARITY_LEVELS, HOVER_DELAYS } from "@/utils/constants.js";
import VirtualSkinsGrid from "@/components/VirtualGrid/VirtualSkinsGrid.jsx";
import useSkins from "@/hooks/useSkins.js";

export default memo(function CollectionSkins() {
  /*const API_URL = process.env.NEXT_PUBLIC_API_URL;*/
  const { userSkins, loading } = useSelector(selectUserSkinsData);
  const [userSkinsFull, setUserSkinsFull] = useState();
  const raritys = RARITY_LEVELS;
  const [searchKeys, setSearchKeys] = useState();
  const deferredSearch = useDeferredValue(searchKeys);
  const [groupedBy, setGroupedBy] = useState("collection");
  const [sortedBy, setSortedBy] = useState();
  const [showNotObtained, setShowNotObtained] = useState(false);
  const [hoveredSkin, setHoveredSkin] = useState(null);
  const [hoveredSkinCardRef, setHoveredSkinCardRef] = useState(null);
  const toolTipPosRef = useRef({ x: 0, y: 0 });
  const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });
  const { skinsData: skins /*, isLoadingSkinsData*/ } = useSkins();
  const { start, cancel, end, currentDelayType } = useHoverIntent({
    initialDelay: HOVER_DELAYS.INITIAL,
    fastDelay: HOVER_DELAYS.FAST,
    resetAfter: HOVER_DELAYS.RESET_AFTER,
  });

  useEffect(() => {
    if (!skins && !userSkins) return;
    const fulfillSkinsWithData = () => {
      const data = skins;

      const userSkinsData = userSkins
        .map((us) => {
          const respectiveSkinData = data?.find(
            (skinData) => skinData.id === us.id,
          );
          return respectiveSkinData
            ? { ...respectiveSkinData, purchaseDate: us.purchaseDate }
            : null;
        })
        .filter(Boolean)
        .reverse();
      return userSkinsData;
    };
    setUserSkinsFull(fulfillSkinsWithData());
  }, [skins, userSkins]);

  const sortOptionsByMode = {
    collection: [
      { value: "purchaseDate", label: "Fecha de compra" },
      { value: "releaseDate", label: "Fecha de lanzamiento" },
      { value: "alphabetical", label: "Alfabético" },
    ],
    all: [
      { value: "releaseDate", label: "Fecha de lanzamiento" },
      { value: "alphabetical", label: "Alfabético" },
    ],
    champion: [
      { value: "mastery", label: "Maestría" },
      { value: "mostOwned", label: "Más en colección" },
      { value: "alphabetical", label: "Alfabético" },
    ],
    set: [
      { value: "mostOwned", label: "Más en colección" },
      { value: "alphabetical", label: "Alfabético" },
    ],
    level: [{ value: "rarity", label: "Nivel (por defecto)" }],
  };

  const countRarity = userSkinsFull
    ? userSkinsFull?.reduce((acc, skin) => {
        acc[skin.rarity] = (acc[skin.rarity] || 0) + 1;
        return acc;
      }, {})
    : raritys.reduce((acc, rarity) => {
        acc[rarity] = 0;
        return acc;
      }, {});

  useEffect(() => {
    const defaultOption = sortOptionsByMode[groupedBy]?.[0]?.value;
    setSortedBy(defaultOption);
  }, [groupedBy]);

  const onHoverStart = useCallback(
    (skin, skinCardRef) => {
      start({
        cb: () => {
          setToolTipPos(toolTipPosRef.current);
          setHoveredSkinCardRef(skinCardRef);
          setHoveredSkin(skin);
        },
        isTooltipOpened: hoveredSkin !== null,
      });
    },
    [start],
  );

  const onHoverEnd = useCallback(() => {
    end(() => setHoveredSkin(null));
    cancel();
    /*probar pasar sethoveredchampion por prop en cancel()*/
  }, [cancel, end]);

  function groupByAcquisitionYear(skins) {
    return Object.entries(
      skins?.reduce((acc, skin) => {
        const year = new Date(skin.purchaseDate).getFullYear();
        acc[year] = acc[year] || [];
        acc[year].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => b - a); // newest → oldest
  }

  function groupByReleaseYear(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        const year = new Date(skin.release).getFullYear();
        acc[year] = acc[year] || [];
        acc[year].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => b - a);
  }

  function groupByChampion(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        acc[skin.champion] = acc[skin.champion] || [];
        acc[skin.champion].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupBySkinline(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        acc[skin.set[0]] = acc[skin.set[0]] || [];
        acc[skin.set[0]].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupByRarity(skins) {
    return Object.entries(
      skins.reduce((acc, skin) => {
        acc[skin.rarity] = acc[skin.rarity] || [];
        acc[skin.rarity].push(skin);
        return acc;
      }, {}),
    ).sort(([a], [b]) => a.localeCompare(b));
  }

  function groupByChampionInitial(skins) {
    const grouped = skins.reduce((acc, skin) => {
      const initial = (skin.champion?.[0] || "#").toUpperCase();
      (acc[initial] ||= []).push(skin);
      return acc;
    }, {});
    // siempre devolver array ordenado por inicial
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }

  function getGroupedSkins(mode, showNotObtained, allSkins, userSkins) {
    // primero agrupamos SOLO lo del usuario
    let groupedUser;
    switch (mode) {
      case "collection":
        if (sortedBy === "releaseDate") {
          groupedUser = groupByReleaseYear(userSkins);
        } else if (sortedBy === "alphabetical") {
          groupedUser = groupByChampionInitial(userSkins);
        } else {
          groupedUser = groupByAcquisitionYear(userSkins);
        }
        break;
      case "all":
        if (sortedBy === "alphabetical") {
          groupedUser = groupByChampionInitial(userSkins);
        } else {
          groupedUser = groupByReleaseYear(userSkins);
        }
        break;
      case "champion":
        groupedUser = groupByChampion(userSkins);
        break;
      case "set":
        groupedUser = groupBySkinline(userSkins);
        break;
      case "level":
        groupedUser = groupByRarity(userSkins);
        break;
      default:
        groupedUser = [];
    }

    // si no hay que mostrar los no obtenidos → listo
    if (!showNotObtained || mode === "") {
      return groupedUser;
    }

    // si hay que mostrar también los no obtenidos
    // eslint-disable-next-line no-undef
    const obtainedIds = new Set(userSkins?.map((s) => s.id));
    const notObtained = allSkins.filter((s) => !obtainedIds.has(s.id));

    let groupedNotObtained;
    switch (mode) {
      case "all":
        if (sortedBy === "alphabetical") {
          groupedNotObtained = groupByChampionInitial(notObtained);
        } else {
          groupedNotObtained = groupByReleaseYear(notObtained);
        }
        break;
      case "champion":
        groupedNotObtained = groupByChampion(notObtained);
        break;
      case "set":
        groupedNotObtained = groupBySkinline(notObtained);
        break;
      case "level":
        groupedNotObtained = groupByRarity(notObtained);
        break;
      default:
        groupedNotObtained = [];
    }

    // combinamos: primero obtenidos, luego no obtenidos
    const combined = [];
    // eslint-disable-next-line no-undef
    const mapNotObtained = new Map(groupedNotObtained);
    for (const [section, skins] of groupedUser) {
      const extras = mapNotObtained.get(section) || [];
      combined.push([section, [...skins, ...extras]]);
      mapNotObtained.delete(section);
    }
    for (const [section, skins] of mapNotObtained) {
      combined.push([section, skins]);
    }
    return combined;
  }

  function applySectionSorting(grouped, groupedBy, sortedBy, userSkins) {
    if (!grouped) return [];
    let sortedGrouped = [...grouped];
    switch (sortedBy) {
      case "purchaseDate":
        sortedGrouped.sort(([a], [b]) => Number(b) - Number(a));
        break;
      case "releaseDate":
        sortedGrouped.sort(([a], [b]) => Number(b) - Number(a));
        break;
      case "alphabetical":
        sortedGrouped.sort(([a], [b]) => a.localeCompare(b));
        break;
      case "mastery":
        sortedGrouped.sort(([, skinsA], [, skinsB]) => {
          const masteryA = skinsA.reduce(
            (sum, s) => sum + (s.championMastery || 0),
            0,
          );
          const masteryB = skinsB.reduce(
            (sum, s) => sum + (s.championMastery || 0),
            0,
          );
          return masteryB - masteryA;
        });
        break;
      case "mostOwned": {
        // eslint-disable-next-line no-undef
        const obtainedIds = new Set(userSkins?.map((s) => s.id));
        sortedGrouped.sort(([, skinsA], [, skinsB]) => {
          const ownedA = skinsA.filter((s) => obtainedIds.has(s.id)).length;
          const ownedB = skinsB.filter((s) => obtainedIds.has(s.id)).length;
          return ownedB - ownedA;
        });
        break;
      }
      default:
        break;
    }
    return sortedGrouped;
  }

  const applySearchFilter = (groupedSections, searchKeys) => {
    if (!searchKeys) return groupedSections;

    const lower = searchKeys.toLowerCase();

    return groupedSections
      .map(([section, skins]) => {
        const filteredSkins = skins.filter((s) =>
          s.name?.toLowerCase().includes(lower),
        );
        return [section, filteredSkins];
      })
      .filter(([, skins]) => skins.length > 0);
  };

  const groupedSkins = useMemo(() => {
    if (!userSkinsFull) return;
    const grouped = getGroupedSkins(
      groupedBy,
      showNotObtained,
      skins,
      userSkinsFull,
    );
    const sectionSorted = applySectionSorting(
      grouped,
      groupedBy,
      sortedBy,
      userSkins,
    );
    const searched = applySearchFilter(sectionSorted, deferredSearch);
    return searched;
  }, [
    groupedBy,
    showNotObtained,
    skins,
    userSkinsFull,
    sortedBy,
    deferredSearch,
  ]);

  /*const [flatList, setFlatList] = useState();

    useEffect(() => {
    const local = []
    groupedSkins.forEach(([section, skins]) => {
      if (section !== 'Todos') {
        local.push({
          type: 'header',
          section,
        });
      }

      skins.forEach((skin) => {
        local.push({
          type: 'skin',
          skin,
        });
      });
    });
    setFlatList(local)
    }, [groupedSkins])*/

  /*function buildVirtualRows(groupedSkins, columns) {
      const rows = [];

      groupedSkins.forEach(([section, skins]) => {
        if (section !== 'Todos') {
          rows.push({
            type: 'header',
            section,
          });
        }

        for (let i = 0; i < skins.length; i += columns) {
          rows.push({
            type: 'row',
            skins: skins.slice(i, i + columns),
          });
        }
      });

      return rows;
    }
    const rows = buildVirtualRows(groupedSkins, 5)*/
  const isSkinInCollection = (id) => userSkins?.some((us) => us.id === id);
  const tooltipRef = useRef();
  /*const RenderSkinsBySections = () => {
        return groupedSkins.map(([section, skins], index) => (
            <div
                key={section}
                className={`skins-section ${
                    groupedSkins.length - 1 === index ? "" : "border-b border-white/10"
                }`}
            >
                {section !== "Todos" ? (
                    <h1
                        className={`${
                            index === 0 ? "mt-[0.6vh] mb-[3.7vh]" : "mt-[2.3vh] mb-[2.3vh]"
                        } text-lg flex items-center content-center`}
                    >
                        {sortedBy === 'purchaseDate' ? 'ADQUIRIDO EL '
                            : sortedBy === 'releaseDate' ? 'LANZADO EL '
                                : null}
                        {section.toUpperCase()}
                    </h1>
                ) : null}
                <div className="skins-grid">
                    {skins.map((skin) => (
                        <SkinCard
                            key={skin.id || `${skin.name}-${skin.champion}`}
                            onHoverStart={onHoverStart}
                            onHoverEnd={onHoverEnd}
                            skin={skin}
                            isSkinInCollection={isSkinInCollection}
                            setToolTipPos={setToolTipPos}
                            toolTipPosRef={toolTipPosRef}
                            groupedSkins={groupedSkins}
                        />
                    ))}
                </div>
            </div>
        ));
    };*/

  return (
    <section className="collection-skins-section">
      <div className="skins-panel">
        <div className="left-place">
          <div className="skins-panel-stats ">
            <svg
              className="hextech-rounded-border"
              id="Capa_2"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 184 211.41"
            >
              <g id="Meters">
                <g>
                  <path
                    className="cls-3"
                    d="M97.78,35.63l-5.78,5.78-5.78-5.78C42.53,38.61,8,74.97,8,119.41s37.61,84,84,84,84-37.61,84-84-34.53-80.81-78.22-83.78Z"
                  />
                  <path
                    className="cls-2"
                    d="M104.19,29.23l-12.19,12.19-12.19-12.19C35.32,35.18,1,73.29,1,119.41c0,50.26,40.74,91,91,91s91-40.74,91-91c0-46.13-34.32-84.23-78.81-90.19Z"
                  />
                  <rect
                    className="cls-1"
                    x="88.46"
                    y="17.88"
                    width="7.07"
                    height="7.07"
                    transform="translate(11.8 71.33) rotate(-45)"
                  />
                </g>
              </g>
            </svg>
            <div className="total-skins-info">
              <div className="amount">{userSkins?.length}</div>
              <div className="description">TOTAL DE ASPECTOS EN COLECCIÓN</div>
            </div>
            <svg
              className="skins-hextech-border"
              id="Capa_2"
              data-name="Capa 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 170.3 192.39"
            >
              <defs></defs>
              <g id="Containers">
                <g>
                  <g>
                    <path
                      className="cls-1"
                      d="M.5,6.47c3.31,0,6-2.67,6-5.97h157.3c0,3.3,2.69,5.97,6,5.97"
                    />
                    <path
                      className="cls-1"
                      d="M11.36,188.16c-1.55-4.48-5.82-7.71-10.86-7.71V12.19c5.04,0,9.31-3.22,10.86-7.71"
                    />
                    <path
                      className="cls-1"
                      d="M169.8,185.92c-3.31,0-6,2.67-6,5.97H6.5c0-3.3-2.69-5.97-6-5.97"
                    />
                    <path
                      className="cls-1"
                      d="M158.95,4.23c1.55,4.48,5.82,7.71,10.86,7.71v168.26c-5.04,0-9.31,3.22-10.86,7.71"
                    />
                  </g>
                </g>
              </g>
            </svg>

            <div className="rarity-icons-container">
              <div className="rarity-icons">
                {raritys.map((rarity) => (
                  <div key={rarity} className="rarity-item">
                    <img
                      className="rarity-image"
                      src={`/raritys/${rarity}.png`}
                      alt={`Rareza ${rarity}`}
                      loading="lazy"
                    />
                    {countRarity[rarity] ? countRarity[rarity] : "0"}
                  </div>
                ))}
              </div>
              <div className="legacy-chromas-icons">
                <div className="legacy-item">
                  <img
                    className="rariry-image w-7"
                    src="/raritys/Legacy.png"
                    alt="Legacy"
                    loading="lazy"
                  />
                  {countRarity["NoRarity"] || "0"}
                </div>
                <div className="chroma-item">
                  <img
                    className="rariry-image w-7"
                    src="/raritys/Chroma.png"
                    alt="Chroma"
                    loading="lazy"
                  />
                  0
                </div>
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
              onChange={(event) => setSearchKeys(event.currentTarget.value)}
              aria-label="Buscar skins"
            />
          </div>
          <div className="checkbox-container">
            {groupedBy !== "collection" ? (
              <div
                className="checkbox"
                onClick={() => setShowNotObtained((prevState) => !prevState)}
                role="checkbox"
                aria-checked={showNotObtained}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowNotObtained((prevState) => !prevState);
                  }
                }}
              >
                <div className="custom-checkbox" aria-hidden="true">
                  {showNotObtained ? <FaCheck className="check-icon" /> : null}
                </div>
                Mostrar no obtenidos
              </div>
            ) : (
              <div className="h-3" aria-hidden="true"></div>
            )}
          </div>
          <CustomSelect
            className="select-filter"
            options={[
              { value: "collection", label: "Mi colección" },
              { value: "all", label: "Todos" },
              { value: "champion", label: "Campeón" },
              { value: "set", label: "Set" },
              { value: "level", label: "Nivel" },
            ]}
            value={groupedBy}
            onChange={setGroupedBy}
            placeholder="Seleccionar agrupación..."
          />
          <CustomSelect
            className="select-filter"
            options={sortOptionsByMode[groupedBy] || []}
            value={sortedBy}
            onChange={setSortedBy}
            placeholder="Seleccionar orden..."
          />
        </div>
      </div>
      {groupedSkins?.length > 0 ? (
        <VirtualSkinsGrid
          onHoverStart={onHoverStart}
          onHoverEnd={onHoverEnd}
          toolTipPosRef={toolTipPosRef}
          userSkins={userSkins}
          groupedSkins={groupedSkins}
          groupedBy={groupedBy}
        />
      ) : (
        <></>
      )}
      {loading == false && groupedSkins?.length == 0 && skins ? (
        <span className="apologize-message">
          We are sorry, no collectible matches your search criteria
        </span>
      ) : null}
      {hoveredSkin ? (
        <SkinTooltip
          cords={toolTipPos}
          delay={100}
          content={{
            skinName: hoveredSkin?.name || null,
            purchaseDate: hoveredSkin?.purchaseDate || null,
            chromas: hoveredSkin?.chromas || null,
            skinRarity: hoveredSkin?.rarity || null,
            inCollection: isSkinInCollection(hoveredSkin?.id) || null,
            value: hoveredSkin?.value || null,
          }}
          position="top"
          currentDelayType={currentDelayType}
          ref={tooltipRef}
          hoveredSkinCardRef={hoveredSkinCardRef}
        />
      ) : null}
    </section>
  );
});
