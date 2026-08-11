"use client";

import ReactDOM from "react-dom";
import "./skinTooltip.css";
import { memo, useRef, useLayoutEffect, useState } from "react";

const SkinTooltip = ({
  content,
  cords,
  currentDelayType,
  hoveredSkinCardRef,
  inCollection
}) => {

  const [coords, setCoords] = useState(cords);
  const [tooltipDirection, setTooltipDirection] = useState("up");
  const ref = useRef();
  const getRem = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const currentRem = getRem();
  useLayoutEffect(() => {
    const tooltipRect = ref.current?.getBoundingClientRect();
    const skinCardRect = hoveredSkinCardRef?.current?.getBoundingClientRect();

    const intendedX = cords.x - tooltipRect?.width / 2;
    const overflowInTop = cords.y + tooltipRect.height > window.innerHeight;

    overflowInTop ? setTooltipDirection("down") : null;

    const newPos = {
      x: intendedX,
      y: overflowInTop
        ? cords.y - tooltipRect.height - skinCardRect?.height - currentRem * 7
        : cords.y,
    };
    setCoords(newPos);
  }, [cords]);

  return (
    <>
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className={`skin-tooltip ${tooltipDirection === "down" && "down"}`}
            ref={ref}
            style={{
              bottom: coords.y,
              left: coords.x,
              position: "fixed",
              animation: `${currentDelayType === "initial" ? "opacity 0.3s" : null}`,
            }}
          >
            <div className="tooltip-header">
              {content.rarity !== "NoRarity" ? (
                <img
                  className="tooltip-rarity-icon"
                  src={`/collection/rarity-gem-icons/${content.rarity.toLowerCase()}.png`}
                ></img>
              ) : null}
              <h2 className="tooltip-skin-name">{content.name}</h2>
            </div>
            <div className="purchase-date-chroma-section">
              {inCollection ? (
                `Adquirido en ${new Date(content.purchaseDate).toLocaleDateString("es-ES")}`
              ) : (
                <>
                  <img
                    className="w-5 h-5 mr-4 rp-icon"
                    src="/general/RP_icon.png"
                  ></img>{" "}
                  <span className="rp-price">{content.value}</span>
                </>
              )}
              {content.chromas ? (
                <img className="chroma-icon" src={`/raritys/Chroma.png`}></img>
              ) : null}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
export default memo(SkinTooltip);
