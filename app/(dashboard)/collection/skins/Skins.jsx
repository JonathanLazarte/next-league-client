"use client";

import { memo } from "react";
import "./skins.css";

import SkinTooltip from "@/components/Tooltip/skinTooltip/skinTooltip";
import VirtualSkinsGrid from "@/components/VirtualGrid/VirtualSkinsGrid";
import useTooltipTrigger from "@/components/Tooltip/globalTooltip/TooltipTrigger";

import Filters from "./components/Filters";
import ControlPanel from "./components/ControlPanel";
import EmptySkinsState from "./components/EmptySkinsState";

import { useSkinsFilter } from "./hooks/useSkinsFilter";
import { useSkinHoverTooltip } from "./hooks/useSkinHoverTooltip";

export default memo(function CollectionSkins() {
  const trigger = useTooltipTrigger();

  const {
    skins,
    userSkins,
    userSkinsFull,
    groupedSkins,
    loading,
    filterState,
    isSkinInCollection,
  } = useSkinsFilter();

  const {
    hoveredSkin,
    hoveredSkinCardRef,
    toolTipPos,
    toolTipPosRef,
    tooltipRef,
    currentDelayType,
    onHoverStart,
    onHoverEnd,
    handleScroll,
  } = useSkinHoverTooltip();

  return (
    <section className="collection-skins-section">
      <div className="side-panel">
        <ControlPanel
          userSkinsCount={userSkins?.length}
          userSkinsFull={userSkinsFull}
          trigger={trigger}
        />

        <Filters
          showNotObtained={filterState.showNotObtained}
          setShowNotObtained={filterState.setShowNotObtained}
          sortedBy={filterState.sortedBy}
          setSortedBy={filterState.setSortedBy}
          groupedBy={filterState.groupedBy}
          setGroupedBy={filterState.setGroupedBy}
          setSearchKeys={filterState.setSearchKeys}
        />
      </div>

      <VirtualSkinsGrid
        groupedSkins={groupedSkins}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        toolTipPosRef={toolTipPosRef}
        userSkins={userSkins}
        groupedBy={filterState.groupedBy}
        handleScroll={handleScroll}
      />

      <EmptySkinsState
        loading={loading}
        groupedSkinsCount={groupedSkins?.length ?? 0}
        hasSkinsData={Boolean(skins)}
      />

      {hoveredSkin && (
        <SkinTooltip
          cords={toolTipPos}
          delay={100}
          content={hoveredSkin}
          position="top"
          currentDelayType={currentDelayType}
          ref={tooltipRef}
          hoveredSkinCardRef={hoveredSkinCardRef}
          inCollection={() => isSkinInCollection(hoveredSkin.id)}
        />
      )}
    </section>
  );
});
