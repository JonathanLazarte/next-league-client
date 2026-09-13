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
import { useResizeObserver } from "@/hooks/useResizeObserver";
import "./virtualGrid.css";

export interface Chroma {
  id: number;
  name: string;
  chromaPath: string;
  colors: string[];
}

export interface Skin {
  id: number;
  name: string;
  splashPath: string;
  uncenteredSplashPath: string;
  tilePath: string;
  loadScreenPath: string;
  chromas?: Chroma[];
  isBase: boolean;
  rarity: SkinRarity;
  cost: number | 'Special';
}

export type SkinRarity =
  | 'NoRarity'
  | 'Standard'
  | 'Epic'
  | 'Legendary'
  | 'Ultimate'
  | 'Mythic'
  | 'Transcendent';

export interface Champion {
  id: number,
  name: string,
  img: Record<string, any>
}

interface VirtualSkinsProps {
  items: Skin[],
  handleClick: () => void,
  StoreCard: React.FunctionComponent<{ item: Skin | Champion}>
}

export default memo(function VirtualSkinsGrid({
  items,
  StoreCard,
}: VirtualSkinsProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  function getRem() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
  const currentRem = getRem();
  const gapValue = currentRem * 1.3;
  const cardWidth = currentRem * 23.1;
  const paddingRightValue = currentRem * 2.85;
  const [columns, setColumns] = useState<number>();

  const getAmountOfColumns = useCallback(
    (containerWidth: number) => {
      const amount = (containerWidth + gapValue + paddingRightValue) / (cardWidth + gapValue);
      return Math.floor(Math.max(amount, 1));
    },
    [gapValue, cardWidth],
  );

  useLayoutEffect(() => {
    if (parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      const rectWidth = rect.width;
      const initialContainerWidth = getAmountOfColumns(rectWidth);
      setColumns(initialContainerWidth);
    }
  }, []);

  const handleResize = useCallback(
    (width: number) => {
      const newCols = getAmountOfColumns(width);

      if (newCols !== columns) {
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
    if (!columns) return []
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
      return 250;
    },
    measureElement: (el) => el.getBoundingClientRect().height,
    gap: gapValue,
    overscan: 6,
  });

  if(!items) return null

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
                  }}
                >
                  {row.skins.map((item, index) => (
                    <StoreCard
                      key={index}
                      item={item}
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
