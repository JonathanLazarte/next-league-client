"use client";

import "./champions.css";
import { useState, memo } from "react";
import Tooltip from "@/components/Tooltip/Tooltip.jsx";
import ChampionDetailModal from "@/components/ChampionDetailModal/ChampionDetailModal.jsx";
import VirtualChampionsGrid from "@/components/VirtualGrid/VirtualChampionsGrid.jsx";
import Filters from './components/Filters'
import EmptyChampionsState from "./components/EmptyChampionsState";
import useChampionHoverTooltip from "./hooks/useChampionHoverTooltip";
import useChampionsFilter from "./hooks/useChampionsFilter";



export default memo(function Champions() {

  const [selectedChampion, setSelectedChampion] = useState(null);


  const {
    onHoverEnd,
    onHoverStart,
    hoveredChampion,
    tooltipPosRef,
    tooltipPos,
    activeChampionRef,
    tooltipRef,
    handleScroll,
    cancel,
    setHoveredChampion,
    currentDelayType
  } = useChampionHoverTooltip()

  const handleChampionClick = (champion) => {
    cancel();
    setHoveredChampion(null);
    setSelectedChampion(championFull[champion.id]);
  };

  const handleCloseModal = () => {
    setSelectedChampion(null);
  };

  const { groupedChampions, userChampions, isLoadingChampionsData, loading, championFull, filterState, setters } = useChampionsFilter()




  return (
    <div className="collection-champions-wrapper">
      <div
        className="collection-champions-content"
        style={{ pointerEvents: `${selectedChampion ? "none" : "unset"}` }}
      >
        <Filters
          setSearchKeys={setters.setSearchKeys}
          inCollection={filterState.inCollection}
          setInCollection={setters.setInCollection}
          groupedBy={filterState.groupedBy}
          setGroupedBy={setters.setGroupedBy}
          sortedBy={filterState.sortedBy}
          setSortedBy={setters.setSortedBy}
        />
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
        <EmptyChampionsState loading={loading} isLoadingChampionsData={isLoadingChampionsData} hasChampionsData={groupedChampions} />
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
