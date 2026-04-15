'use client';
import ReactDOM from 'react-dom';
import styles from './ToolTip.module.css';
import { GiPadlock } from "react-icons/gi";
import { GiAngelWings } from "react-icons/gi";

const Tooltip = ({ content, /*toolTipPos : coords*/ hoveredChampion }) => {
  /*const [coords, setCoords] = useState({ top: 0, left: 0 });*/
  /*const wrapperRef = useRef(null);*/
  const coords = hoveredChampion?.position || { y:0, x: 0};

 /* const hideTooltip = () => {
    // Limpiar el timeout si el mouse sale antes de que aparezca
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  // Limpiar el timeout cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);*/

  return (
    <>
      {hoveredChampion?.champion &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            className={styles.tooltip}
            style={{
              top: coords.y,
              left: coords.x,
              position: 'fixed',
              display: `${hoveredChampion.champion ? 'flex' : 'none'}`
            }}
          >
            {/* Sección superior - Información del campeón */}
            <div className={styles.championSection}>
              <div className={styles.championHeader}>
                <div className={styles.masteryIcon}>
                  <span className={styles.masteryLevel}>{content.masteryLevel}</span>
                </div>
                <h3 className={styles.championName}>{content.championName}</h3>
              </div>
              <div className={styles.separator}></div>
              <div className={styles.championInfo}>
                <div className={styles.masteryPoints}>
                  <span className={styles.wingIcon}><GiAngelWings /></span>
                  <span>{content.masteryPoints} / 1,800 pts.</span>
                </div>
                <div className={styles.seasonRating}>
                  <span>Calificación más alta de la temporada:</span>
                  <span className={styles.ratingValue}>{content.maxSeasonRating}</span>
                </div>
              </div>
            </div>

            {/* Sección media - INICIO */}
            <div className={styles.startSection}>
              <h4 className={styles.sectionTitle}>INICIO</h4>
              <div className={styles.startButton}>
                <span>{content.startInfo}</span>
              </div>
              { content.freeToPlay ? <div className={styles.freePlay}>
                <span className={styles.hexagonIcon}>6</span>
                <span>Juégalo gratis</span>
              </div> : null }
            </div>

            {/* Sección inferior - PROGRESIÓN DE ETERNOS */}
            <div className={styles.eternalsSection}>
              <div className={styles.separator}></div>
              <h4 className={styles.eternalsTitle}>PROGRESIÓN DE ETERNOS</h4>
              <div className={styles.eternalsList}>
                {content.eternals.map((eternal, index) => (
                  <div key={index} className={styles.eternalItem}>
                    <span>{eternal}</span>
                    <span className={styles.lockIcon}><GiPadlock /></span>
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;