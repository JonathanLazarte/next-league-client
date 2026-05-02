import { memo } from "react";
/*import { GiDoubled, GiDividedSquare } from "react-icons/gi";*/
import { GiPadlock } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { openPurchaseModal } from "@/redux/slices/purchaseSlice.js";
import { preload } from "react-dom";
import "./ChampionStore.css";

const PokeCard = ({ id, item: data }) => {
  const dispatch = useDispatch();

  const handleClick = async () => {
    await preload(`/splash/${data.id}.jpg`, { as: "image" });
    dispatch(openPurchaseModal({ itemId: data.id, type: "champion" }));
  };
  return (
    <article
      id={id}
      className="pokemon-card"
      onClick={() => {
        handleClick();
      }}
    >
      {" "}
      {/* Unique key and card class */}
      <img
        className="pokemon"
        id={id} // Set unique ID for potential usage
        src={`/tiles/${data.id}_0.jpg`}
        alt={`Sprite of ${data.name}`} // Add alt text for accessibility
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
        <GiPadlock className="unlock-product-icon" />
      </div>
    </article>
  );
};

export default memo(PokeCard);
