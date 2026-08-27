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
import { RESOURCES_URL } from "@/utils/constants";

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
  const [imageLoading, setImageLoading] = useState(true);
  const delayedImageLoading = useLoadingDelay(imageLoading, { delay: 400 })

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
      ? `${RESOURCES_URL}/splash/${productInfo?.id}_0.jpg`
      : `${RESOURCES_URL}/splash/${productInfo?.img}`;

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
                <svg className="rp-icon" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#e3ba3d" fill-rule="evenodd" clip-rule="evenodd" d="M8.63343 2.25848L6.5001 0.600098L4.36676 2.25848V8.25781L6.5001 9.7405L8.63343 8.25781V2.25848ZM12.0468 6.1152L12.9001 5.49383L10.3401 3.11553V9.11486L7.35343 11.2575V13.4001L12.9001 9.68479L12.0468 8.68634V6.1152ZM2.6601 3.11553L0.100098 5.49383L0.953431 6.1152V8.68634L0.100098 9.68479L5.64676 13.4001V11.2575L2.6601 9.11486V3.11553Z" />
                </svg>
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
                  <svg className="be-icon" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#0acbe6" fill-rule="evenodd" clip-rule="evenodd" d="M6 16L9 12L0 8L6 16ZM9 3.2L6 0L0.75 6.4L5.25 8L9 3.2ZM9.75 5.6L6.75 8.8L9.75 10.4L12 8L9.75 5.6Z"/>
                  </svg>
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
                    fill
                    onLoad={() => setImageLoading(false)}
                    style={{
                      visibility: !delayedImageLoading ? "visible" : "hidden",
                    }}
                  />
                  {delayedImageLoading && <div className="loading-image">
                    <div className={`loading-spinner medium`}>
                      <img
                        alt="loading spinner"
                        className="spinner-ring"
                        src="/general/loading-spinner-blue.png"
                      />
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
