"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useRef,
  useMemo,
  memo,
  useState,
  useCallback,
  useLayoutEffect,
} from "react";
import { useResizeObserver } from "@/hooks/useResizeObserver.js";
import "./virtualGrid.css";

export default memo(function VirtualSkinsGrid({
  items,
  handleClick,
  StoreCard,
}) {
  const parentRef = useRef(null);
  //const { width : containerWidth } = useContainerSize(parentRef);

  function getRem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  const currentRem = getRem();
  const gapValue = currentRem * 1;
  const cardWidth = getRem() * 23.1;
  //const headerHeight = currentRem * 5;

  /*function getColumns(containerWidth) {
    //const { width } = getCardSize();
    //const cardWidth = getRem() * 23.1;

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
  }*/
  const [columns, setColumns] = useState();

  const getAmountOfColumns = useCallback(
    (containerWidth) => {
      const amount = (containerWidth + gapValue) / (cardWidth + gapValue);
      return Math.floor(Math.max(amount, 2));
    },
    [gapValue, cardWidth],
  );

  useLayoutEffect(() => {
    if (parentRef.current) {
      const rect = parentRef?.current?.getBoundingClientRect();
      const rectWidth = rect.width;
      const initialContainerWidth = getAmountOfColumns(rectWidth);
      setColumns(initialContainerWidth);
    }
  }, []);

  const handleResize = useCallback(
    (width) => {
      const newCols = getAmountOfColumns(width);

      if (newCols > 1 && newCols !== columns) {
        newCols > 5 ? setColumns(5) : setColumns(newCols);
      }
    },
    [columns, getAmountOfColumns],
  );

  useResizeObserver(parentRef, handleResize);

  //-----------------------------------------------------------------------------------------------
  // Construimos filas
  const itemsCopy = items ? [...items] : [];
  const rows = useMemo(() => {
    const result = [];

    for (let i = 0; i < itemsCopy.length; i += columns) {
      result.push({
        type: "row",
        skins: itemsCopy.slice(i, i + columns),
      });
    }
    return result;
  }, [items, columns]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    // Altura dinámica según tipo
    estimateSize: () => {
      return cardWidth;
    },
    measureElement: (el) => el.getBoundingClientRect().height,
    gap: gapValue,
    overscan: 6,
  });

  return (
    <div ref={parentRef} className="virtual-store-grid">
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
              {row.type === "row" && (
                <div
                  style={{
                    display: "grid",
                    gap: `${gapValue}px`,
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    /*padding: `0 ${gapValue}px`,*/
                  }}
                >
                  {row.skins.map((item, index) => (
                    <StoreCard
                      key={index}
                      item={item}
                      handleClick={handleClick}
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
