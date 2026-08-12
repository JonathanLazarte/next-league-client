import { memo } from "react";
import { usePurchase } from "@/hooks/usePurchase";
import { preload } from "react-dom";
import "./Champion.css";
import Image from 'next/image'

const ChampionCard = ({ id, item: data }) => {
  const { openPurchaseModal } = usePurchase();

  const handleClick = async () => {
    await preload(`/splash/${data.id}.jpg`, { as: "image" });
    openPurchaseModal({ itemId: data.id, type: "champion" });
  };
  return (
    <article
      id={id}
      className="store-champion-item"
      onClick={() => {
        handleClick();
      }}
    >
      {" "}
      {/* Unique key and card class */}
      <Image
        className="store-champion-image"
        id={id} // Set unique ID for potential usage
        src={`/tiles/${data.id}_0.jpg`}
        alt={`Sprite of ${data.name}`} // Add alt text for accessibility
        sizes={'23rem'}
        fill
      />
      <div className="product-info">
        <h4 className="card-name">{data.name}</h4>
        <div className="price">
          <div className="rp-price">
            <img className="rp-icon-card" src="/general/RP_icon.png"></img>
            <span className="price-number">{data.price.rp}</span>
          </div>
          <div className="essences-price">
            <img className="be-icon-card" src="/general/BE_icon.png"></img>
            <span className="price-number">{data.price.be}</span>
          </div>
        </div>
      </div>
      <div className="unlock-icon-box">
        <img className="unlock-product-icon" src='/unlock-icon.png'></img>
      </div>

    </article>
  );
};

export default memo(ChampionCard);
