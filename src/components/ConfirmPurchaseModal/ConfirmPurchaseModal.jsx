"use client";
import ReactDOM from "react-dom";
import { useState } from "react";
import Image from "next/image";
import { useMemo } from "react";
import { LiaLongArrowAltUpSolid } from "react-icons/lia";
import useLoadingDelay from "@/hooks/useLoadingDelay";
import "./confirmPurchaseModal.css";
import { usePurchase } from "@/hooks/usePurchase";
import useSkins from "@/hooks/useSkins";
import useChampions from "@/hooks/useChampions";

// Custom hook for purchase window logic
export default function ConfirmPurchaseWindow() {
  const {
    wallet: { RP: walletRP, BE: walletBE },
    itemToBuy,
    status,
    closeModal,
    confirmPurchase,
  } = usePurchase();
  //const token = localStorage.getItem("token");
  //const [ chapionsData, setChampionsData ] = useState()
  const { championsData } = useChampions();
  const { skinsData } = useSkins();
  const isProcessing = status === "processing";
  const showLoading = useLoadingDelay(isProcessing, { delay: 300, minDisplayTime: 1000 });
  const showSuccess = status === "success" && !showLoading;

  const productInfo = useMemo(() => {
    if (!itemToBuy) return null;

    const data =
      itemToBuy?.type === "champion" ? Object.values(championsData) : skinsData;
    const puntualItem = data?.find((item) => item.id === itemToBuy?.id);

    return puntualItem;
  }, [itemToBuy, championsData, skinsData]);

  // Memoized price calculation
  const productPrice = useMemo(
    () => ({
      rp: productInfo?.price?.rp || productInfo?.value || 0,
      be: productInfo?.price?.be || 0,
    }),
    [productInfo],
  );

  // Memoized balance calculation
  const newBalance = useMemo(
    () => ({
      rp: walletRP - productPrice.rp,
      be: walletBE - productPrice.be,
    }),
    [walletRP, walletBE, productPrice.rp, productPrice.be],
  );

  // Memoized button styles
  const buttonStyles = useMemo(
    () => ({
      rp:
        walletRP - productPrice.rp >= 0
          ? null
          : { filter: "grayscale(0.5)", cursor: "default" },
      be:
        walletBE - productPrice.be >= 0
          ? null
          : { filter: "grayscale(0.5)", cursor: "default" },
    }),
    [walletRP, walletBE, productPrice.rp, productPrice.be],
  );

  const productImg =
    itemToBuy?.type === "champion"
      ? `/splash/${productInfo?.id}_0.jpg`
      : `/splash/${productInfo?.img}`;

  // Optimized purchase function
  const buyProduct = (coin, price) => {
    confirmPurchase({ coin, price }).unwrap();
  };
  const closeWindow = () => {
    closeModal();
  };

  const DefaultBottom = () => {
    return (
      <div className="product-actions">
        <div className="license-info">
          Esta compra otorga una licencia para este producto digital.{" "}
          <a
            className="more-info"
            href="https://www.riotgames.com/es-419/terms-of-service-LATAM#:~:text=4.1."
            target="_blank"
            rel="noopener noreferrer"
          >
            Mas información{" "}
            <LiaLongArrowAltUpSolid className="more-info-icon" />
          </a>
        </div>

        <div className="product-buy-buttons">
          <div className="button-container">
            <div
              onClick={() => {
                if (newBalance.rp >= 0) {
                  buyProduct("RP", productPrice.rp);
                }
              }}
              style={buttonStyles.rp}
              className="buy-rp-button"
            >
              <>
                <img
                  className="w-4 h-4 rp-icon"
                  src="/general/RP_icon.png"
                  alt="RP"
                />
                {productPrice.rp}
              </>
              {newBalance.rp >= 0 ? (
                <span className="new-balance">
                  nuevo saldo: {newBalance.rp} RP
                </span>
              ) : (
                <span className="new-balance" style={{ color: "red" }}>
                  Saldo insuficiente
                </span>
              )}
            </div>
          </div>

          {itemToBuy?.type === "champion" && (
            <div className="button-container">
              <div
                onClick={() => {
                  if (newBalance.be >= 0) {
                    buyProduct("BE", productPrice.be);
                  }
                }}
                style={buttonStyles.be}
                className="buy-be-button"
              >
                <>
                  <img
                    className="w-4 h-4 be-icon"
                    src="/general/BE_icon.png"
                    alt="BE"
                  />
                  {productPrice.be}
                </>
                {newBalance.be >= 0 ? (
                  <span className="new-balance">
                    nuevo saldo: {newBalance.be} EA
                  </span>
                ) : (
                  <span className="new-balance" style={{ color: "red" }}>
                    Saldo insuficiente
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SuccessBottom = () => {
    return (
      <div className="purchase-success-message">
        <span>
          You have unlocked {productInfo.name}! Check out champion detail page
          for some quick tips on how to play {productInfo.name}. GLHF!{" "}
        </span>
        <div
          onClick={closeModal}
          className="general-button done-purchase-modal-button"
        >
          Done
        </div>
      </div>
    );
  };
  const [imageLoading, setImageLoading] = useState(true);
  const delayedImageLoading = useLoadingDelay(imageLoading)

  return (
    typeof window !== "undefined" &&
    ReactDOM.createPortal(
      <>
        {productInfo ? (
          <div
            className="confirm-purchase-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-purchase-window">
              <div className="confirm-purchase-window-content">
                <button className="exit-button" onClick={closeWindow}>
                  X
                </button>

                <div className="image-container">
                  <Image
                    className="product-image"
                    src={productImg}
                    alt={productInfo.name}
                    sizes={'40rem'}
                    fill
                    onLoad={() => setImageLoading(false)}
                    style={{
                      visibility: !delayedImageLoading ? "visible" : "hidden",
                    }}
                  />
                  {delayedImageLoading && <div className="loading-image">
                    <div className={`loading-spinner medium`}>
                      <img className="spinner-ring" src="/general/loading-spinner-blue.png"></img>
                    </div>
                  </div>}
                  <div className="gradient"></div>
                </div>

                <div className="product-title">
                  <h2 className="product-name">
                    {productInfo.name?.toUpperCase()}
                  </h2>
                  {!showSuccess ? (
                    <span className="product-subtitle">
                      {itemToBuy?.type !== "skin"
                        ? productInfo.title
                        : "Elige este nuevo estilo para tu campeón!"}
                    </span>
                  ) : (
                    <span className="product-subtitle">Item unlocked!</span>
                  )}
                </div>

                {!showLoading ? (
                  <>{!showSuccess ? <DefaultBottom /> : <SuccessBottom />}</>
                ) : (
                  <div className="purchase-loading-bottom">
                    <div className={`loading-spinner small`}>
                      <img className="spinner-ring" src="/general/loading-spinner-blue.png"></img>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>,
      document.body,
    )
  );
}
