import { memo } from "react";
import { usePurchase } from "@/hooks/usePurchase";
/*import { preload } from "react-dom";*/
import "./Champion.css";
import Image from 'next/image'
import { RESOURCES_URL } from "@/utils/constants";

const ChampionCard = ({ id, item: data }) => {
  const { openPurchaseModal } = usePurchase();

  const handleClick = async () => {
    /*await preload(`${RESOURCES_URL}/splash/${data.id}.jpg`, { as: "image" });*/
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
        id={id}
        src={`${RESOURCES_URL}/tiles/${data.id}_0.jpg`}
        alt={`Sprite of ${data.name}`}
        sizes={'23rem'}
        fill
      />
      <div className="product-info">
        <h4 className="card-name">{data.name}</h4>
        <div className="price">
          <div className="rp-price">
            <div className="currency-icon-wrapper">
              <Image alt='rp icon' sizes={'1.8rem'} width={24} height={24} className="rp-icon-card" src="/general/RP_icon.png"></Image>
            </div>
            <span className="price-number">{data.price.rp}</span>
          </div>
          <div className="essences-price">
            <div className="currency-icon-wrapper">
              <Image alt='be icon' sizes={'1.8rem'} width={52} height={65} className="be-icon-card" src="/general/BE_icon.png"></Image>
            </div>
            <span className="price-number">{data.price.be}</span>
          </div>
        </div>
      </div>
      <div className="unlock-icon-box">
        <Image width={50} height={50} alt="unlock icon" className="unlock-product-icon" src='/unlock-icon.png'></Image>
      </div>

    </article>
  );
};

export default memo(ChampionCard);
