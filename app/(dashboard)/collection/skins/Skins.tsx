"use client";

import { memo, useMemo } from "react";
import "./skins.css";

import SkinTooltip from "@/components/tooltips/SkinTooltip/SkinTooltip";
import VirtualSkinsGrid from "@/components/virtual-grids/VirtualSkinsGrid";
import useTooltipTrigger from "@/components/tooltips/GlobalTooltip/TooltipTrigger";

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
    filterState,
    loadingUserSkins,
    loadingSkinsData
  } = useSkinsFilter();

  const {
    hoveredSkin,
    hoveredSkinCardRef,
    tooltipPos,
    tooltipPosRef,
    currentDelayType,
    onHoverStart,
    onHoverEnd,
    handleScroll,
  } = useSkinHoverTooltip();

  const isSkinInCollection = useMemo(() => {
      const id = hoveredSkin?.id
      return userSkins?.some((us) => us.id === id)
    }, [userSkins, hoveredSkin])

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

      {!loadingSkinsData && !loadingUserSkins && <VirtualSkinsGrid
        groupedSkins={groupedSkins}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
        tooltipPosRef={tooltipPosRef}
        userSkins={userSkins}
        groupedBy={filterState.groupedBy}
        handleScroll={handleScroll}
      />}

      <EmptySkinsState
        loading={loadingUserSkins}
        groupedSkinsCount={groupedSkins?.length ?? 0}
        hasSkinsData={Boolean(skins)}
      />

      {hoveredSkin && (
        <SkinTooltip
          cords={tooltipPos}
          content={hoveredSkin}
          position="top"
          currentDelayType={currentDelayType}
          hoveredSkinCardRef={hoveredSkinCardRef}
          inCollection={isSkinInCollection}
        />
      )}
    </section>
  );
});
