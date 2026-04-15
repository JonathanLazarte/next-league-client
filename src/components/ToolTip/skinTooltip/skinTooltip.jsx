'use client';

import ReactDOM from 'react-dom';
import './skinTooltip.css';

const SkinTooltip = ({ content, hoveredSkin, cords : coords }) => {
  /*const [visible, setVisible] = useState(true);*/
  /*const [coords, setCoords] = useState({ top: 0, left: 0 });*/
  

  return (
    <>

      {hoveredSkin &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(
          <div
            className="skin-tooltip"
            style={{
              bottom: coords.y,
              left: coords.x,
              position: 'fixed',
            }}
          >

          <div className="tooltip-header">
            {content.skinRarity !== 'NoRarity' ? <img className="tooltip-rarity-icon" src={`/raritys/${content.skinRarity}.png`}></img> : null}
            <h2 className="tooltip-skin-name">{content.skinName}</h2>
          </div>
          <div className="purchase-date-chroma-section">
            {
            content.inCollection ? `Adquirido en ${new Date(content.purchaseDate).toLocaleDateString('es-ES')}`
            : <><img className="w-5 h-5 mr-4 rp-icon" src="/general/RP_icon.png"></img> <span className="rp-price">{content.value}</span></>
            }
            {content.chromas ? <img className="chroma-icon" src={`/raritys/Chroma.png`}></img> : null}
          </div>
            
          </div>,
          document.body
        )}
    </>
  );
};

export default SkinTooltip;