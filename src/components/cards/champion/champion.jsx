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
  /*tooltipRef,*/
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
          <div className="mastery-box" aria-hidden="true">
            <div className="mastery">
              <svg
                className="mastery-icon"
                id="Capa_2"
                data-name="Capa 2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 29.45"
              >
                <g id="Capa_1-2" data-name="Capa 1">
                  <g>
                    <path d="M19.34,5.33l11.47.02.15.19v20.42c-.08.34-.49.49-.77.66-1.22.77-3.33,2.08-4.6,2.64-.61.27-.67.24-1.24-.03-1.75-.85-3.44-2.09-5.19-2.97l-.2-.39-.02-20.1c0-.25.19-.37.4-.44Z" />
                    <path d="M50,5.94c-.02.09-.23.49-.31.55l-8.38,4.81c-.05.04-.22.16-.22.2v1.52s.14.15.21.13l5.01-2.49c.28-.1.39.08.42.34.12.91.09,3.35,0,4.3-.02.23-.07.46-.23.63l-5.5,3.23c-.21.29,0,2.7-.08,3.29-.02.16-.04.3-.17.42l-4.79,2.62c-.13.06-.25.03-.34-.08l.05-18.65c.11-.16.3-.21.46-.3,4.22-2.3,8.98-4.02,13.24-6.28.11-.09.65-.25.65-.03v5.81Z" />
                    <path d="M0,.13C.02.07.14,0,.21,0c4.71,2.18,9.47,4.33,14.09,6.7v18.8c-.1.07-.61-.22-.75-.29-1.45-.74-2.84-1.61-4.29-2.36-.13-.11-.16-.26-.17-.42-.06-.54.11-3.09-.02-3.31l-5.48-3.14c-.25-.15-.29-.35-.31-.61-.09-.98-.12-3.44,0-4.39.02-.14.04-.27.17-.34.32-.16,4.66,2.37,5.39,2.49v-1.77L.31,6.47c-.08-.05-.31-.41-.31-.45V.13Z" />
                  </g>
                </g>
              </svg>
            </div>
            <div className="eternals">
              <div className="eternals-content">
                <svg
                  className="eternals-icon"
                  id="Capa_2"
                  data-name="Capa 2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 39.83"
                >
                  <g id="Capa_1-2" data-name="Capa 1">
                    <g>
                      <path d="M25.57,18.33c.94.42,1.83,1.56,2.2,2.52,1.16,3.03-.71,5.7-3.4,6.94-4.43,2.04-14.86,2.04-19.02-.7C.17,23.68,3.12,15.82,7.86,13.56c-.15.81-.54,1.56-.62,2.39-.06.66-.02,1.81.28,2.4.89,1.78,3.15-.62,3.85-1.52,1.39-1.79,2.04-4,1.69-6.27s-1.69-3.95-.94-6.2c.5-1.49,1.85-2.86,3.18-3.65.29-.17,1.26-.69,1.53-.72.51-.06.08.34-.02.61-1.15,3.02-.08,5.89,1.68,8.39s4.39,4.52,4.12,7.83c-.1,1.16-1.02,2.73-.55,3.79.58,1.33,2.47,1.1,3.19,0,.52-.79.41-1.42.34-2.31Z" />
                      <path d="M29.79,25.88c.14-.12.16,0,.18.13.18,1.45-.57,4.05-1.15,5.41-4.67,10.89-21.51,11.2-27.09.99C.77,30.65-.11,27.83.03,25.84c0-.03-.13-.64.14-.32.24.29.54.96.82,1.34,4.18,5.58,15.65,5.77,21.78,4.17,2.9-.76,5.41-2.1,6.91-4.77.06-.1.1-.37.11-.38Z" />
                    </g>
                  </g>
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
