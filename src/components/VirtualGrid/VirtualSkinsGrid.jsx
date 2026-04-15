"use client";

"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo, useState, useCallback } from "react";
import SkinCard from "@/components/cards/skin/skin.jsx";
import { useResizeObserver } from "@/hooks/useResizeObserver.js";
import "./virtualGrid.css";

export default function VirtualSkinsGrid({
  groupedSkins,
  onHoverStart,
  onHoverEnd,
  toolTipPosRef,
  userSkins,
  groupedBy,
}) {
  const parentRef = useRef(null);
  /*const { width : containerWidth } = useContainerSize(parentRef);*/
  const [columns, setColumns] = useState(5);
  const isSkinInCollection = (id) => userSkins?.some((us) => us.id === id);

  function getRem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  const currentRem = getRem();
  const gapValue = currentRem * 2.8;
  const columnGap = currentRem * 3.8;
  //const headerHeight = currentRem * 5;

  function getColumns(containerWidth) {
    //const { width } = getCardSize();
    const cardWidth = getRem() * 17.7;

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
    (containerWidth) => {
      const newCols = getColumns(containerWidth);
      if (newCols > 0 && newCols !== columns) {
        setColumns(newCols);
      }
    },
    [columns, getColumns],
  );

  useResizeObserver(parentRef, handleResize);

  //-----------------------------------------------------------------------------------------------

  // Construimos filas
  const rows = useMemo(() => {
    const result = [];

    groupedSkins?.forEach(([section, skins]) => {
      if (section !== "Todos") {
        result.push({
          type: "header",
          section:
            groupedBy === "collection" ? `Obtenido en ${section}` : section,
        });
      }

      for (let i = 0; i < skins.length; i += columns) {
        result.push({
          type: "row",
          skins: skins.slice(i, i + columns),
        });
      }
    });

    return result;
  }, [groupedSkins, columns]);

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
    gap: columnGap,
    overscan: 6,
  });

  return (
    <div ref={parentRef} className="skins-grid-container">
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
                  {row.skins.map((skin) => (
                    <SkinCard
                      key={skin.id || `${skin.name}-${skin.champion}`}
                      onHoverStart={onHoverStart}
                      onHoverEnd={onHoverEnd}
                      skin={skin}
                      isSkinInCollection={isSkinInCollection}
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
}
