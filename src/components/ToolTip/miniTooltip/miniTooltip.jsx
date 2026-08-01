"use client";

import React, { useState, useRef} from "react";
import ReactDOM from "react-dom";
import "./miniTooltip.css";

const MiniTooltip = ({
  content,
}) => {
  const [visible, /*setVisible*/] = useState(false);
    const [coords, /*setCoords*/] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);


  const TABS_STRINGS = {
    collection: "Colección",
    store: "Tienda",
    loot: "Botín",
  };
  return (
    <>
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="mini-tooltip"
            ref={tooltipRef}
            style={{
              top: coords.top,
              left: coords.left,
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
