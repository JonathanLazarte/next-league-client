"use client";
import { memo, useRef, useCallback } from "react";
import Image from 'next/image'
import "./Champion.css";
import { GiPadlock } from "react-icons/gi";
import { RESOURCES_URL } from "@/utils/constants";
import { useSound } from "@/hooks/useSound";

const ChampionCard = ({
  id,
  champion,
  onClick,
  adquired,
  onHoverEnd,
  onHoverStart,
  tooltipPosRef,
}) => {
  const { play: playGridHover } = useSound("/sfx/sfx-uikit-grid-hover.ogg")
  const { play: playGridClick } = useSound("/sfx/sfx-uikit-grid-click.ogg")

  const handleClick = useCallback(() => {
    playGridClick()
    if (onClick) {
      onClick(champion);
    }
  }, [onClick, champion]);

  const handleMouseOver = () => {
    playGridHover();
  }

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const ref = useRef(null);

  const getPosition = (localRef) => {
    const position = "right";
    const wrapperRef = localRef.current;
    const rect = localRef.current.getBoundingClientRect();
    //const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    const getRem = () => {
      return parseFloat(getComputedStyle(document.documentElement).fontSize);
    };
    const currentRem = getRem();
    const tooltipHeight = currentRem * 40;
    const tooltipWidth = currentRem * 35.6;

    // Encontrar el contenedor padre (el elemento que contiene el grid de campeones)
    if (wrapperRef) {
      let parentContainer =
        wrapperRef.closest(".champions-grid-container") ||
        wrapperRef.closest(".collection") ||
        wrapperRef.closest(".pokedex-container") ||
        null;
      // Si no encontramos un contenedor específico, usar el body
      if (!parentContainer) {
        parentContainer = document.body;
      }

      const parentRect = parentContainer.getBoundingClientRect();

      let top = 0;
      let left = 0;
      let detectedPosition = position;

      // Detectar automáticamente la mejor posición basada en el contenedor padre
      if (position === "right") {
        // Si está muy a la derecha del contenedor padre, cambiar a izquierda
        const rightEdge = rect.right - parentRect.left;
        if (rightEdge + tooltipWidth + 2 * currentRem > parentRect.width) {
          detectedPosition = "left";
        }
      } else if (position === "left") {
        // Si está muy a la izquierda del contenedor padre, cambiar a derecha
        const leftEdge = rect.left - parentRect.left;
        if (leftEdge - tooltipWidth - 20 < 0) {
          detectedPosition = "right";
        }
      }

      // Calcular posición basada en la posición detectada
      switch (detectedPosition) {
        case "top":
          top = rect.top - tooltipHeight - 8;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          // Asegurar que no se salga del contenedor padre
          if (left < parentRect.left + 8) left = parentRect.left + 8;
          if (left + tooltipWidth > parentRect.right - 8)
            left = parentRect.right - tooltipWidth - 8;
          break;

        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          // Asegurar que no se salga del contenedor padre
          if (left < parentRect.left + 8) left = parentRect.left + 8;
          if (left + tooltipWidth > parentRect.right - 8)
            left = parentRect.right - tooltipWidth - 8;
          break;

        case "left":
          top = rect.top + rect.height / 2;
          left =
            parentRect.right -
            (parentRect.right - rect.left) -
            2.4 * currentRem -
            tooltipWidth /*rect.left - currentRem * 34*/ /*8*/;
          // Asegurar que no se salga del contenedor padre
          /*if (top < parentRect.top + 8) top = parentRect.top + 8;*/

          break;

        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + currentRem * 2.4 /*8*/;
          // Asegurar que no se salga del contenedor padre
          /*if (top < parentRect.top + 8) top = parentRect.top + 8;*/

          break;
      }
      return { x: left, y: top };
    }
  };

  return (
    <div
      id={id}
      className={` champion-card ${adquired ? "adquired" : null}`}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Campeón ${champion.name}${adquired ? " - Adquirido" : " - No adquirido"}`}
    >
      <div
        ref={ref}
        className="champion-sprites"
        onMouseEnter={() => {
          tooltipPosRef.current = getPosition(ref);
          onHoverStart(champion, ref);
        }}
        onMouseLeave={onHoverEnd}
      >
        <Image
          className="champion-image"
          width={308}
          height={560}
          src={`${RESOURCES_URL}/loading/${champion.id}_0.jpg`}
          alt={`${champion.name} sprite`}
        />
        {adquired ? (
          <div className="mastery-box" aria-hidden="true">
            <Image className="mastery" src="/collection/mastery-flag-empty.png" alt="mastery-flag" width={86} height={52} />
            <div className="eternals">
              <div className="eternals-content">

                <svg className="eternals-icon" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1556 9.49196L9.85123 10.8494C9.37691 11.3425 8.71535 11.6233 8.02258 11.6233H4.14996C3.75677 11.6233 3.36982 11.5328 3.01719 11.3581C2.13095 10.9181 1.45067 10.1629 1.11677 9.24543L0.573787 7.7538C0.483291 7.50415 0.555064 7.22642 0.75478 7.04855L3.12017 4.96089L2.51166 6.12798C2.32443 6.48373 2.33379 6.90813 2.5335 7.26075L2.90797 7.91919C3.01095 8.10018 3.26684 8.12827 3.40726 7.96912L5.34825 5.78784C5.53861 5.57564 5.60726 5.28231 5.53237 5.0077L4.78655 2.32089L6.88357 0.666992L6.24386 2.11181C6.13152 2.36458 6.1752 2.65791 6.35308 2.87011L9.07421 6.08118C9.27705 6.32146 9.31137 6.6616 9.15535 6.93309L8.48442 8.11579C8.3752 8.30926 8.53435 8.5433 8.75903 8.51834L9.95109 8.38415C10.1851 8.35919 10.3599 8.16259 10.3599 7.93167V6.74274L11.2773 8.79295C11.3866 9.03011 11.3366 9.30472 11.1556 9.49196ZM0.626837 11.1802C1.99989 16.7223 10.0447 16.7129 11.4022 11.1677L11.4552 10.9586L10.182 12.1694C9.6796 12.6468 9.00556 12.9152 8.30343 12.9152H4.03762C3.49152 12.9152 2.9579 12.7529 2.50854 12.4503L0.626837 11.1802Z" fill="#5B5A56"/>
                </svg>

                <div className="eternals-value">0</div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="unlock-champion-button"
            aria-label="Campeón bloqueado"
          >
            <GiPadlock
              style={{ transform: "rotate(-45deg)" }}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <h2 className="champion-name">{champion.name}</h2>
    </div>
  );
};

export default memo(ChampionCard);
