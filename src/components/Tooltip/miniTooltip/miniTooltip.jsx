"use client";

import React, { useState, useRef} from "react";
import ReactDOM from "react-dom";
import "./miniTooltip.css";
import { SECTION_LABELS } from '@/utils/constants'

const MiniTooltip = ({
  content,
  position
}) => {
  const [visible, /*setVisible*/] = useState(true);
  const tooltipRef = useRef(null);

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
            { SECTION_LABELS[content] || "??" }
          </div>,
          document.body,
        )}
    </>
  );
};

export default MiniTooltip;
