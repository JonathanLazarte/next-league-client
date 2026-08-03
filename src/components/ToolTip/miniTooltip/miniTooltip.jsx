"use client";

import React, { useState, useRef} from "react";
import ReactDOM from "react-dom";
import "./miniTooltip.css";

const MiniTooltip = ({
  content,
  position
}) => {
  const [visible, /*setVisible*/] = useState(true);
  const [coords, /*setCoords*/] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);

  const TABS_STRINGS = {
    collection: "Collection",
    store: "Store",
    loot: "Loot",
  };
  return (
    <>
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="mini-tooltip"
            ref={tooltipRef}
            style={{
              top: position?.y | 0,
              left: position?.x | 0,
              position: "fixed",
              visibility: visible ? "visible" : "hidden",
            }}
          >
            {TABS_STRINGS[content] || "??"}
          </div>,
          document.body,
        )}
    </>
  );
};

export default MiniTooltip;
