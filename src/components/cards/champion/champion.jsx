"use client";
import { memo, useRef, useCallback } from "react";
import "./champion.css";
import { GiPadlock } from "react-icons/gi";

const ChampionCard = ({
  id,
  champion,
  onClick,
  adquired,
  onHoverEnd,
  onHoverStart /*, gridWrapperRef*/,
  tooltipPosRef,
  tooltipRef,
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(champion);
    }
  }, [onClick, champion]);

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
    const tooltipWidth = currentRem * 32;

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
            tooltipWidth -
            2 * currentRem /*rect.left - currentRem * 34*/ /*8*/;
          // Asegurar que no se salga del contenedor padre
          /*if (top < parentRect.top + 8) top = parentRect.top + 8;*/

          break;

        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + currentRem * 2 /*8*/;
          // Asegurar que no se salga del contenedor padre
          /*if (top < parentRect.top + 8) top = parentRect.top + 8;*/

          break;
      }
      /*setActualPosition(detectedPosition);
            setCoords({ top, left });*/
      return { x: left, y: top };
    }
  };

  return (
    <div
      id={id}
      className={` champion-card ${adquired ? "adquired" : null}`}
      onClick={handleClick}
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
        <img
          className="champion-image"
          src={`/loading/${champion.id}_0.jpg`}
          alt={`${champion.name} sprite`}
          loading="lazy"
        />
        {adquired ? (
          <div className="mastery-box" aria-hidden="true"></div>
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
