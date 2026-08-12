"use client";

import React, { useState, useRef} from "react";
import ReactDOM from "react-dom";
import "./TextTooltip.css";
import { SECTION_LABELS } from '@/utils/constants'

const TextTooltip = ({
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
            { SECTION_LABELS[content] || content || '??' }
          </div>,
          document.body,
        )}
    </>
  );
};

export default TextTooltip;
