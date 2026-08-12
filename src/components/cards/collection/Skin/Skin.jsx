"use client";

import { memo, useRef } from "react";
import { GiPadlock } from "react-icons/gi";
import Image from 'next/image'

import "./Skin.css";

export default memo(function SkinCard({
  onHoverStart,
  onHoverEnd,
  skin,
  isSkinInCollection,
  toolTipPosRef,
}) {
  const ref = useRef(null);
  const getRem = () => {
    return parseFloat(getComputedStyle(document.documentElement).fontSize);
  };
  const currentRem = getRem();

  /*useSmartHover({
    ref,
    onEnter: () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      // Actualizar el ref directamente sin causar re-render
      if (toolTipPosRef) {
        toolTipPosRef.current = {
          x: rect.right - rect.width / 2,
          y: window.innerHeight - rect.top + currentRem * 3,
        };
      }
      onHoverStart(skin, ref);
    },
    onLeave: onHoverEnd,
  });*/
  const isObtained = isSkinInCollection(skin.id);

  return (
    <div
      className={`skin-card ${isObtained ? "" : "not-obtained"}`}
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Skin ${skin.name}${isObtained ? " - Obtenido" : " - No obtenido"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
        }
      }}
      onMouseEnter={() => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        // Actualizar el ref directamente sin causar re-render
        if (toolTipPosRef) {
          toolTipPosRef.current = {
            x: rect.right - rect.width / 2,
            y: window.innerHeight - rect.top + currentRem * 3,
          };
        }
        onHoverStart(skin, ref);
      }}
      onMouseLeave={onHoverEnd}
    >
      {isObtained ? (
        <img className="skin-card-border" src={`/collection/borders/borders_normal.png`}></img>
      ) : null}
      {
        <Image
          className={`skin-card-image ${isObtained ? "" : "not-obtained"}`}
          src={`/loading/${skin.img}`}
          alt={`${skin.name} skin`}
          loading="lazy"
          clipPath="url(#card-shape)"
          preserveAspectRatio="xMidYMid slice"
          width={308}
          height={560}
        />
      }
      {isObtained ? (
        skin.rarity !== "NoRarity" && (
          <img
            className="skin-card-rarity-image"
            src={`/collection/rarity-gem-icons/${skin.rarity.toLowerCase()}.png`}
            alt={`Rareza ${skin.rarity}`}
            loading="lazy"
            aria-hidden="true"
          />
        )
      ) : (
        <div className="unlock-champion-button" aria-label="Skin bloqueado">
          <GiPadlock
            style={{ transform: "rotate(-45deg)" }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
});
