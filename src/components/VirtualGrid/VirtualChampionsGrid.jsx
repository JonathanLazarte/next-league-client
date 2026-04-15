"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo, memo, useState, useCallback } from "react";
import ChampionCard from "@/components/cards/champion/champion.jsx";
import { useResizeObserver } from "@/hooks/useResizeObserver.js";
import "./virtualGrid.css";

export default memo(function VirtualSkinsGrid({
  onHoverStart,
  onHoverEnd,
  toolTipPosRef,
  groupedChampions,
  handleChampionClick,
  userChampions,
  groupedBy,
}) {
  const parentRef = useRef(null);
  //const { width : containerWidth } = useContainerSize(parentRef);
  const [columns, setColumns] = useState(5);
  //const [ rowHeight, setRowHeight ] = useState(100);

  function getRem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  const currentRem = getRem();
  const gapValue = currentRem * 2;
  //const headerHeight = currentRem * 5;

  function getColumns(containerWidth) {
    //const { width } = getCardSize();
    const cardWidth = getRem() * 18;

    const totalGap = (cols) => {
      return gapValue * (cols - 1);
    };
    const newCols = Math.max(
      1,
      Math.floor((containerWidth - totalGap(columns)) / cardWidth),
    );

    if (newCols === columns) return columns;

    const hypotheticWidth = totalGap(newCols) + cardWidth * newCols;

    return hypotheticWidth <= containerWidth ? newCols : columns;
  }

  const handleResize = useCallback(
    (width) => {
      const newCols = getColumns(width);
      if (newCols > 0 && newCols !== columns) {
        setColumns(newCols);
      }
    },
    [columns],
  );

  useResizeObserver(parentRef, handleResize);

  //-----------------------------------------------------------------------------------------------
  const groupedChampionsCopy = { ...groupedChampions };
  // Construimos filas
  const rows = useMemo(() => {
    const result = [];

    Object.keys(groupedChampionsCopy).forEach((section) => {
      if (section !== "Todos") {
        result.push({
          type: "header",
          section:
            groupedBy === "collection" ? `Obtenido en ${section}` : section,
        });
      }

      for (let i = 0; i < groupedChampionsCopy[section].length; i += columns) {
        result.push({
          type: "row",
          skins: groupedChampionsCopy[section].slice(i, i + columns),
        });
      }
    });

    return result;
  }, [groupedChampions, columns, groupedBy]);

  /*useResizeObserver(parentRef, width => {

  setCardHeight(getRowHeight())
  const newCols = getColumns(width)
    if (newCols > 0 && newCols !== columns) {
      setColumns(newCols);
    }

  })*/

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    // Altura dinámica según tipo
    estimateSize: (index) => {
      const row = rows[index];

      if (row.type === "header") {
        return 100;
      }

      return 400;
    },
    measureElement: (el) => el.getBoundingClientRect().height,
    gap: 0,
    overscan: 6,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: "100%",
        overflow: "auto",
      }}
      className="champions-grid-container"
    >
      <div
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {/* HEADER */}
              {row.type === "header" && (
                <div className="skins-section-header">
                  <span>{row.section}</span>
                </div>
              )}

              {/* ROW */}
              {row.type === "row" && (
                <div
                  style={{
                    display: "flex",
                    gap: `${gapValue}px`,
                    /*padding: `0 ${gapValue}px`,*/
                  }}
                >
                  {row.skins.map((c, index) => (
                    <ChampionCard
                      key={c.id || index} // Usar poke.id si está disponible, de lo contrario, index
                      id={index}
                      champion={c}
                      adquired={userChampions.some((uc) => uc.id == c.id)}
                      onClick={handleChampionClick}
                      onHoverStart={onHoverStart}
                      onHoverEnd={onHoverEnd}
                      toolTipPosRef={toolTipPosRef}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
