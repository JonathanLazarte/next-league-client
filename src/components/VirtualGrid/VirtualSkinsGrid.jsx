"use client";

"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useMemo, useState, useCallback, useLayoutEffect } from "react";
import SkinCard from "@/components/cards/skin/skin.jsx";
import { useResizeObserver } from "@/hooks/useResizeObserver.js";
import { useThrottledCallback } from "@/hooks/useThrottle";
import "./virtualGrid.css";

export default function VirtualSkinsGrid({
  groupedSkins,
  onHoverStart,
  onHoverEnd,
  toolTipPosRef,
  userSkins,
  groupedBy,
  handleScroll,
}) {
  const parentRef = useRef(null);
  /*const { width : containerWidth } = useContainerSize(parentRef);*/
  const [columns, setColumns] = useState();
  const isSkinInCollection = (id) => userSkins?.some((us) => us.id === id);
  console.log(columns)

  function getRem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  const currentRem = getRem();
  const gapValue = currentRem * 3;
  const columnGap = currentRem * 3.8;
  const paddingRightValue = currentRem * 3.3;
  const cardWidth = getRem() * 16;
  //const headerHeight = currentRem * 5;

  const getAmountOfColumns = useCallback(
    (containerWidth) => {
      const amount =
        (containerWidth + gapValue - paddingRightValue) /
        (cardWidth + gapValue);
      return Math.max(Math.floor(amount), 1);
    },
    [gapValue, cardWidth],
  );
  const throttledHandleScroll = useThrottledCallback(handleScroll, 500);

  useLayoutEffect(() => {
    if (parentRef.current) {
      const rect = parentRef?.current?.getBoundingClientRect();
      const rectWidth = rect.width;
      const initialContainerWidth = getAmountOfColumns(rectWidth);
      setColumns(initialContainerWidth);
      parentRef.current.addEventListener("scroll", throttledHandleScroll, {
        pasive: true,
      });
    }
    return () =>
      parentRef?.current?.removeEventListener("scroll", throttledHandleScroll);
  }, []);

  const handleResize = useCallback(
    (containerWidth) => {
      const newCols = getAmountOfColumns(containerWidth);
      if (newCols > 0 && newCols !== columns) {
        setColumns(newCols);
      }
    },
    [columns, getAmountOfColumns],
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

  if(!groupedSkins) return <></>

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
                    display: "grid",
                    gap: `${gapValue}px`,
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,

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
