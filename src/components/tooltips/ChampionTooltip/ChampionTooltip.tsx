"use client";
import ReactDOM from "react-dom";
import styles from "./ChampionTooltip.module.css";
import { GiPadlock } from "react-icons/gi";
import { GiAngelWings } from "react-icons/gi";
import { memo, forwardRef, useState } from "react";
import { useLayoutEffect } from "react";

interface Champion {
  masteryLevel: string,
  championName: string,
  masteryPoints: number,
  startInfo: string,
  maxSeasonRating: string,
  freeToPlay: boolean,
  eternals: Record<string, any>
}

interface TooltipProps {
  content: Champion
  tooltipPos: { x: number, y: number }
  currentDelayType: string
}

const Tooltip = (
  { content, tooltipPos, currentDelayType }: TooltipProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) => {
  const [coords, setCoords] = useState(tooltipPos);

  useLayoutEffect(() => {
    if (!ref) return

    let tooltipHeight = 0

    if (ref && 'current' in ref && ref.current) {
       tooltipHeight = ref?.current.getBoundingClientRect().height;
    }

    /*const tooltipWidth = ref.current.getBoundingClientRect().width;*/
    /*const championCard = activeChampionRef.current?.getBoundingClientRect();    SE DEBE USER ESTE REF PARA POSICIONAR EL TOOLTIP Y REMOVER LA FUNCION QUE AHORA ESTA SIENDO USADA EN CHAMPION.JSX*/
    const viewportHeight = window.innerHeight;
    const getRem = () => {
      return parseFloat(getComputedStyle(document.documentElement).fontSize);
    };
    const currentRem = getRem();

    const getPositionY = () => {
      const initialPos = tooltipPos.y;
      const intendedPos = initialPos - tooltipHeight / 2;

      const overflowInTop = intendedPos < 0;
      const overflowInBottom = intendedPos + tooltipHeight > viewportHeight;

      //const lowerPosition = intendedPos + tooltipHeight / 4;
      const upperPosition = intendedPos - tooltipHeight / 2;

      if (overflowInTop) {
        return initialPos;
      }
      if (overflowInBottom) {
        return upperPosition + tooltipHeight < viewportHeight
          ? upperPosition
          : viewportHeight - tooltipHeight - 2 * currentRem;
      }

      return intendedPos;
    };

    const newTooltipPos = {
      y: getPositionY(),
      x: tooltipPos.x,
    };
    setCoords(newTooltipPos);
  }, [tooltipPos]);

  return (
    <>
      {typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div
            ref={ref}
            className={`${styles.tooltip} ${currentDelayType === "initial" ? "initial-delay" : null}`}
            style={{
              top: coords.y,
              left: coords.x,
              position: "fixed",
              animation: `${currentDelayType === "initial" ? "opacity 0.3s" : null}`,
            }}
          >
            {/* Sección superior - Información del campeón */}
            <div className={styles.championSection}>
              <div className={styles.championHeader}>
                <div className={styles.masteryIcon}>
                  <span className={styles.masteryLevel}>
                    {content.masteryLevel}
                  </span>
                </div>
                <h3 className={styles.championName}>{content.championName}</h3>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.championInfo}>
                <div className={styles.masteryPoints}>
                  <span className={styles.wingIcon}>
                    <GiAngelWings />
                  </span>
                  <span>{content.masteryPoints} / 1,800 pts.</span>
                </div>
                <div className={styles.seasonRating}>
                  <span>Calificación más alta de la temporada:</span>
                  <span className={styles.ratingValue}>
                    {content.maxSeasonRating}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección media - INICIO */}
            <div className={styles.startSection}>
              <h4 className={styles.sectionTitle}>INICIO</h4>
              <div className={styles.startButton}>
                <span>{content.startInfo}</span>
              </div>
              {content.freeToPlay ? (
                <div className={styles.freePlay}>
                  <span className={styles.hexagonIcon}>6</span>
                  <span>Juégalo gratis</span>
                </div>
              ) : null}
            </div>

            {/* Sección inferior - PROGRESIÓN DE ETERNOS */}
            <div className={styles.eternalsSection}>
              <div className={styles.separator}></div>
              <h4 className={styles.eternalsTitle}>PROGRESIÓN DE ETERNOS</h4>
              <div className={styles.eternalsList}>
                {content.eternals.map((eternal: string[], index: string) => (
                  <div key={index} className={styles.eternalItem}>
                    <span>{eternal}</span>
                    <span className={styles.lockIcon}>
                      <GiPadlock />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

const ChampionTooltipWithRef = forwardRef(Tooltip);
ChampionTooltipWithRef.displayName = "ChampionTooltip";
export default memo(ChampionTooltipWithRef);
