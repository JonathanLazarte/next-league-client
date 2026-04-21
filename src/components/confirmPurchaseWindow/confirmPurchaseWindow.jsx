"use client";
import ReactDOM from "react-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useState, useCallback, useMemo, useEffect } from "react";
import { LiaLongArrowAltUpSolid } from "react-icons/lia";
import useLoadingDelay from "@/hooks/useLoadingDelay";
import "./confirmPurchaseWindow.css";
import { Riple } from "react-loading-indicators";
import {
  closeModal,
  confirmPurchase,
  selectPurchaseData,
} from "@/redux/slices/purchaseSlice.js";
import useSkins from "@/hooks/useSkins";
import useChampions from "@/hooks/useChampions";

// Custom hook for purchase window logic
export default function ConfirmPurchaseWindow() {
  const dispatch = useDispatch();
  const { RP: walletRP, BE: walletBE } = useSelector(
    (state) => ({
      RP: state.user.RP,
      BE: state.user.BE,
    }),
    shallowEqual,
  );
  const token = localStorage.getItem("token");
  //const [ chapionsData, setChampionsData ] = useState()
  const { championsData } = useChampions();
  const { skinsData } = useSkins();
  const { itemToBuy, selectedCurrency, status } =
    useSelector(selectPurchaseData);
  const isProcessing = status === "processing";
  const showLoading = useLoadingDelay(isProcessing);
  const [showSuccess, setShowSuccess] = useState(false);

  const obtainProductInfo = (itemToBuy) => {
    if (itemToBuy) {
      const data =
        itemToBuy?.type === "champion"
          ? Object.values(championsData)
          : skinsData;
      const puntualItem = data?.find((item) => item.id === itemToBuy?.id);

      return puntualItem;
    } else {
      return null;
    }
  };

  const productInfo = useMemo(() => {
    if (!itemToBuy) return null;

    const data =
      itemToBuy?.type === "champion" ? Object.values(championsData) : skinsData;
    const puntualItem = data?.find((item) => item.id === itemToBuy?.id);

    return puntualItem;
  }, [itemToBuy, championsData, skinsData]);

  // Este useEffect maneja la transición loading → success
  useEffect(() => {
    if (status === "success" && !showLoading) {
      setShowSuccess(true); // activa el mensaje de éxito

      // Delay para mostrar el éxito y luego cerrar
      const timer = setTimeout(() => {
        setShowSuccess(false);
        dispatch(closeModal());
      }, 2200); // 2.2 segundos se siente natural

      return () => clearTimeout(timer); // cleanup importante
    }

    // Si vuelve a loading o hay error, ocultamos el success
    if (showLoading || status === "failed") {
      setShowSuccess(false);
    }
  }, [status, showLoading, dispatch]); // dependencias clave

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
  const buyProduct = useCallback(
    async (coin, price) => {
      try {
        await dispatch(confirmPurchase({ coin, price })).unwrap();
        setTimeout(() => {}, 1500);
        //await dispatch(updateCoins({ coin, price }));
      } catch (error) {
        console.error("Purchase failed:", error);
      }
    },
    [dispatch, token],
  );
  const closeWindow = () => {
    dispatch(closeModal());
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
                  <img
                    className="product-image"
                    src={productImg}
                    alt={productInfo.name}
                  />
                  <div className="gradient"></div>
                </div>

                <div className="product-title">
                  <h2 className="product-name">
                    {productInfo.name?.toUpperCase()}
                  </h2>
                  <span className="product-subtitle">
                    {itemToBuy?.type !== "skin"
                      ? productInfo.title
                      : "Elige este nuevo estilo para tu campeón!"}
                  </span>
                </div>

                {!showSuccess ? (
                  <div className="product-actions">
                    <div className="license-info">
                      Esta compra otorga una licencia para este producto
                      digital.
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
                          {selectedCurrency === "RP" && showLoading ? (
                            <Riple color="blue" size="large" />
                          ) : (
                            <>
                              <img
                                className="w-4 h-4 rp-icon"
                                src="/general/RP_icon.png"
                                alt="RP"
                              />
                              {productPrice.rp}
                            </>
                          )}
                          {newBalance.rp >= 0 ? (
                            <span className="new-balance">
                              nuevo saldo: {newBalance.rp} RP
                            </span>
                          ) : (
                            <span
                              className="new-balance"
                              style={{ color: "red" }}
                            >
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
                            {selectedCurrency === "BE" && showLoading ? (
                              <Riple color="blue" size="large" />
                            ) : (
                              <>
                                <img
                                  className="w-4 h-4 be-icon"
                                  src="/general/BE_icon.png"
                                  alt="BE"
                                />
                                {productPrice.be}
                              </>
                            )}
                            {newBalance.be >= 0 ? (
                              <span className="new-balance">
                                nuevo saldo: {newBalance.be} EA
                              </span>
                            ) : (
                              <span
                                className="new-balance"
                                style={{ color: "red" }}
                              >
                                Saldo insuficiente
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="purchase-success-message">
                    <span>Compra realizada con exito</span>
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
