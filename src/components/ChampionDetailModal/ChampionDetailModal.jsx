"use client";



import React, { useState, useEffect, memo, useRef } from "react";
import { createPortal } from 'react-dom'
import Image from 'next/image'
import useLoadingDelay from '@/hooks/useLoadingDelay'

import styles from "./ChampionDetailModal.module.css";
import "./ChampionDetailModal.css";
import { usePurchase } from "@/hooks/usePurchase";
import { useUserChampions } from "@/hooks/useUserChampions";
import { useUserSkins } from "@/hooks/useUserSkins";
/*aspectos imports*/
import { GiPadlock } from "react-icons/gi";
import { IoArrowForward } from "react-icons/io5";


export const CloseModalButton = ({ onClose }) => {
  const [buttonState, setButtonState] = useState('idle')
  const handleMouseEnter = () => {
    setButtonState('hovered');
  }
  const handleMouseLeave = () => {
    setButtonState('idle');
  }
  const handleClick = () => {
    setButtonState('pressed');
    onClose();
  }
  return (<div
    className={styles.closeButton}
    onClick={handleClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    {buttonState === 'idle' && <img src='/general/button-x.png'></img>}
    {buttonState === 'hovered' && <img src='/general/button-x-over.png'></img>}
    {buttonState === 'pressed' && <img src='/general/button-x-down.png'></img>}
  </div>)
}


const ResumenTab = memo(function ResumenTab({
  champion,
  championImg,
  isChampionInCollection,
  onUnlockChampion,
}) {
  const difficulty = champion?.info.difficulty;
  console.log(champion)
  return (
    <div style={{ backgroundImage: `linear-gradient(
        to right,
        var(--blue-five) 0%,
        var(--blue-five) 16%,
        transparent 100%
    ), ${championImg}` }} className={styles.content}>
      {/* Left Panel - Information */}
      <div className={styles.leftPanel}>
        <div className={styles.graphics}>
          <div className={styles.info}>
            <div className={styles.damageType}>
              <span className={styles.damageLabel}>DAMAGE:</span>
              <span className={styles.damageValue}>Physical</span>
            </div>
            <div className={styles.styleSection}>
              <span className={styles.styleLabel}>STYLE:</span>
              <div className={styles.styleSlider}>
                <div className={styles.meleeIcon}>
                  <img src="/champion-details/continuum_icon_attackspeed.png"></img>
                </div>
                <div className={styles.sliderTrack}>
                  <div
                    className={styles.sliderThumb}
                    style={{ left: "40%" }}
                  ></div>
                </div>
                <div className={styles.rangedIcon}>
                  <img src="/champion-details/continuum_icon_abilitypower_grey.png"></img>
                </div>
              </div>
            </div>
            <div className={styles.difficultySection}>
              <span className={styles.difficultyLabel}>DIFFICULTY:</span>
              <div className={styles.difficultyBar}>
                {difficulty > 0 && difficulty <= 4 ? <img
                  src="/champion-details/difficultygraph_difficulty1.png"
                  className={styles.difficultyLevel}>
                </img> : null}
                {difficulty > 4 && difficulty <= 7 ? (
                  <img
                    className={styles.difficultyLevel}
                    src="/champion-details/difficultygraph_difficulty2.png"
                  ></img>
                ) : null}
                {difficulty > 7 ? (
                  <img
                    className={styles.difficultyLevel}
                    src="/champion-details/difficultygraph_difficulty3.png"
                  ></img>
                ) : null}
              </div>
            </div>
          </div>
          <div className={styles.statsRadar}>
            <div className={styles.radarChart}>
              {[
                { name: "damage", value: 3, hover_icon: 'cdp-graph-damage-hover' },
                { name: "toughness", value: 2, hover_icon: 'cdp-graph-toughness-hover' },
                { name: "crowd-control", value: 3, hover_icon: 'cdp-graph-crowd-control-hover' },
                { name: "mobility", value: 1, hover_icon: 'cdp-graph-mobility-hover' },
                { name: "utility", value: 2, hover_icon: 'cdp-graph-utility-hover' },
              ].map((stat, index) => {
                const rotationDegree = index * 72
                return (
                  <>
                    <img
                      className={styles.graphTraitIcon}
                      src={`/champion-details/${stat.hover_icon}.png`}
                      key={index}
                    >
                    </img>
                    <img
                      src={`/champion-details/cdp-graph-segment-l${stat.value}.png`}
                      className={styles.graphSegmentLevel}
                      style={{transform: `rotate(${rotationDegree}deg)`}}
                    />
                  </>
                );
              })}
              <img src='/champion-details/cdp_graph_backing.png' className={styles.radarBackground}></img>
            </div>
          </div>
        </div>
        <div className={styles.loreSection}>
          <p className={styles.loreText}>
            {champion.lore}
          </p>
        </div>
        <div className={styles.actionButtons}>
          {isChampionInCollection ? (
            <button className="general-button disabled">EN COLECCIÓN</button>
          ) : (
            <button className="general-button" onClick={onUnlockChampion}>
              DESBLOQUEAR
            </button>
          )}
          <button
            onClick={() => {
              window.open(
                `https://www.leagueoflegends.com/es-es/champions/${champion.id.toLowerCase()}/`,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            className="general-button"
          >
            SABER MÁS
            <IoArrowForward />
          </button>
        </div>
      </div>
      {/* Right Panel - Champion Illustration */}
      <div className={styles.rightPanel}>
        <div className={styles.championIllustration}>
          <img
            src={`/splash/${champion.id}_0.jpg`}
            alt={champion.name}
            className={styles.illustrationImage}
          />
          <div className={styles.energyEffects}></div>
        </div>
      </div>
    </div>
  );
});

const AspectosTab = memo(function AspectosTab({ champion, activeTab }) {
  const [selectedSkin, setSelectedSkin] = useState(0);
  const { userSkins } = useUserSkins();
  const totalSkins = champion.skins.length;
  const [isBackgroundImageLoaded, setIsBackgroundImageLoaded] = useState(false);

  const isSkinInCollection =
    selectedSkin === 0 ||
    userSkins.some((us) => us.key == champion.skins[selectedSkin]?.id);
  const { openPurchaseModal } = usePurchase();

  const isThisSkinInCollection = (skinContextIndex) => {
    return (
      skinContextIndex == 0 ||
      userSkins.some((us) => us.key == champion.skins[skinContextIndex].id)
    );
  };
  const handleUnlockSkin = () => {
    const selectedSkinId = champion?.skins[selectedSkin]?.id;
    openPurchaseModal({ itemId: selectedSkinId, type: "skin" });
  };
  const getVisibleSkins = () => {
    const visibleSkins = [];

    if (totalSkins <= 5) {
      const slotsToShow = Math.min(5, totalSkins);
      const offset = Math.floor((5 - slotsToShow) / 2);

      for (let i = 0; i < 5; i++) {
        if (i >= offset && i < offset + slotsToShow) {
          const skinIndex = i - offset;
          visibleSkins.push(skinIndex);
        } else {
          visibleSkins.push(null);
        }
      }
      return visibleSkins;
    }

    const carouselPositions = [0, 1, 2, 3, 4];

    carouselPositions.forEach((position, index) => {
      if (index === 2) {
        visibleSkins.push(selectedSkin);
      } else {
        let skinIndex;
        if (index < 2) {
          skinIndex = selectedSkin - (2 - index);
          if (skinIndex < 0) skinIndex += totalSkins;
        } else {
          skinIndex = selectedSkin + (index - 2);
          if (skinIndex >= totalSkins) skinIndex -= totalSkins;
        }
        visibleSkins.push(skinIndex);
      }
    });

    return visibleSkins;
  };

  const goToPreviousSkin = () => {
    setSelectedSkin((prev) => (prev - 1 + totalSkins) % totalSkins);
    setIsBackgroundImageLoaded(false);
  };

  const goToNextSkin = () => {
    setSelectedSkin((prev) => (prev + 1) % totalSkins);
    setIsBackgroundImageLoaded(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (activeTab === "aspectos") {
        switch (event.key) {
          case "ArrowLeft":
            event.preventDefault();
            goToPreviousSkin();
            break;
          case "ArrowRight":
            event.preventDefault();
            goToNextSkin();
            break;
          default:
            break;
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedSkin, totalSkins]);

  const visibleSkins = getVisibleSkins();

  return (
    <div
      className="content"
    >
      <Image
        className="skin-background-image"
        src={`/${window.innerWidth < 767 ? "loading" : "splash"}/${champion.id}_${champion.skins[selectedSkin].num}.jpg`}
        alt={champion.name}
        onLoad={() => setIsBackgroundImageLoaded(true)}
        height={'800'}
        width={'1320'}
        quality={'100%'}
      />
      <div className="background-skin-image-placeholder" style={{ visibility: !isBackgroundImageLoaded ? "visible" : "hidden" }}></div>
      <div className="bottom-panel">
        <h3 className="skin-name">
          {" "}
          {selectedSkin != 0
            ? champion.skins[selectedSkin].name
            : champion.name}{" "}
        </h3>
        <div className="skin-navigator">
          <div className="navigator-line"></div>
          <div className="minibuttons-container">
            {champion.skins.map((_, index) => (
              <div
                key={index}
                onClick={() => { setSelectedSkin(index); setIsBackgroundImageLoaded(false); }}
                className={`navigator-minibutton ${index == selectedSkin ? "active" : null}`}
              ></div>
            ))}
          </div>
          <div className="navigator-line"></div>
        </div>
        <div className="actions">
          {isSkinInCollection ? (
            <div className="unlock-button disabled"> EN COLECCION </div>
          ) : (
            <div className="unlock-button" onClick={handleUnlockSkin}>
              {" "}
              DESBLOQUEAR{" "}
            </div>
          )}
          <div className="skin-changer">
            <div className="skin-minicards-container">
              {visibleSkins.map((skinIndex, position) => (
                <div
                  key={`${skinIndex}-${position}`}
                  onClick={() => {
                    skinIndex !== null && setSelectedSkin(skinIndex);
                    setIsBackgroundImageLoaded(false);
                  }}
                  className={`skin-minicard ${skinIndex === selectedSkin ? "selected" : ""} ${skinIndex === null ? "empty" : ""}`}
                  style={{
                    transform:
                      position === 2 && skinIndex !== null
                        ? "scale(1.1)"
                        : "scale(1)",
                    zIndex: position === 2 ? 10 : 5 - Math.abs(position - 2),
                    transition: "all 0.3s ease-in-out",
                    opacity: skinIndex === null ? 0.3 : 1,
                    cursor: skinIndex === null ? "default" : "pointer",
                  }}
                  role={skinIndex !== null ? "button" : undefined}
                  tabIndex={skinIndex !== null ? 0 : -1}
                  aria-label={
                    skinIndex !== null
                      ? `Skin ${skinIndex + 1} de ${champion.name}`
                      : "Slot vacío"
                  }
                  onKeyDown={(e) => {
                    if (
                      skinIndex !== null &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      setSelectedSkin(skinIndex);
                    }
                  }}
                >
                  {skinIndex !== null ? (
                    <>
                      <img
                        src={`/tiles/${champion.id}_${champion.skins[skinIndex].num}.jpg`}
                        className="skin-minicard-image"
                        alt={`Skin ${skinIndex + 1} de ${champion.name}`}
                      />
                      {!isThisSkinInCollection(skinIndex) ? (
                        <GiPadlock
                          className={`skin-locked-icon ${skinIndex === selectedSkin && "selected"}`}
                        />
                      ) : null}
                    </>
                  ) : (
                    <div className="empty-slot">
                      <span>—</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const HabilidadesTab = memo(function HabilidadesTab({ champion }) {
  const spellKeys = ["P", "Q", "W", "E", "R"];
  const [selectedSpell, setSelectedSpell] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const showLoading = useLoadingDelay(isVideoLoading);
  /*const videosRef = useRef < HTMLVideoElement[] > ([]);*/
  const videoRef = useRef([])

  useEffect(() => {
    videoRef.current.forEach((video, index) => {
      if (!video) return;

      if (index === selectedSpell) {
        video.currentTime = 0; // empezar desde el inicio
        video.play();
      } else {
        video.pause();
      }
    });
  }, [selectedSpell]);

  return (
    <div className="spells-section">
      {spellKeys.map((spellKey, index) => (
        <video
          key={index}
          ref={(video) => {
            if (video) {
              videoRef.current[index] = video;
            }
          }}
          className={`spell-video ${selectedSpell === index ? "selected" : null}`}
          src={`https://lol.dyn.riotcdn.net/x/videos/champion-abilities/0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}/ability_0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}_${spellKey}1.mp4`}
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoading(false)}
          onLoadStart={() => setIsVideoLoading(true)}
        />
      ))}
      <div className={`video-placeholder`} style={{ visibility: showLoading ? "visible" : "hidden" }}>
        <div className={`loading-spinner medium`}>
          <img className="spinner-ring" src="/general/loading-spinner-blue.png"></img>
        </div>
      </div>
      <div className="spells-panel">
        <div className="sprites-container">
          <div className="passive-item">
            <div onClick={() => {
              setSelectedSpell(0);
            }} className={`passive-image-container ${selectedSpell === 0 ? "selected" : null}`}>
              <img
                className='passive-image'
                src={`/passive/${champion.passive.image.full}`}
                />
            </div>
            P
          </div>
          <div className="spell-separator"></div>
          {champion.spells.map((spell, index) => {
            return (
              <div key={index} className="spell-item">
                <div className={`spell-image-container ${selectedSpell === index + 1 ? "selected" : null}`}>
                  <img
                    key={index}
                    onClick={() => {
                      setSelectedSpell(index + 1);
                    }}
                    className='spell-image'
                    src={`/spell/${spell.image.full}`}
                    />
                </div>
                {spellKeys[index + 1]}
              </div>
            );
          })}
        </div>
        <div className="skill-info">
          <h3 className="skill-name">
            {" "}
            {selectedSpell !== 0
              ? champion.spells[selectedSpell - 1].name
              : champion.passive.name}{" "}
          </h3>
          <p className="skill-description">
            {selectedSpell !== 0
              ? champion.spells[selectedSpell - 1].description
              : champion.passive.description}
          </p>
        </div>
      </div>
    </div>
  );
});

const ChampionDetailModal = ({ champion, onClose }) => {
  const [activeTab, setActiveTab] = useState("resumen");
  const { userChampions } = useUserChampions();
  const { openPurchaseModal } = usePurchase();

  if (!champion) return null;

  const isChampionInCollection = userChampions?.some(
    (c) => c.id == champion.id,
  );

  const tabs =
    window.innerWidth > 767
      ? [
          { id: "resumen", label: "RESUMEN" },
          { id: "habilidades", label: "HABILIDADES" },
          /*{ id: "maestria", label: "MAESTRÍA" },
          { id: "eternos", label: "ETERNOS" },*/
          { id: "aspectos", label: "ASPECTOS" },
        ]
      : [
          { id: "resumen", label: "RESUMEN" },
          { id: "habilidades", label: "HABILIDADES" },
          { id: "aspectos", label: "ASPECTOS" },
        ];

  const championImg = `url('/${activeTab === "resumen" ? "centered" : "splash"}/${champion.id}_0.jpg')`;
  /*const skinFileName = `${champion.id}_`*/
  const handleUnlockChampion = () => {
    openPurchaseModal({ itemId: champion.id, type: "champion" });
  };

  if (!champion) return null;
  return typeof window !== 'undefined' && createPortal((
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.championInfoBorder}>
            <div className={styles.championInfo}>
              <div className={styles.championIcon}>
                <img
                  src={`/champion-details/role-icon-${champion.tags[0].toLowerCase()}.png`}
                  alt={champion.name}
                  className={styles.iconImage}
                />
              </div>
              <div className={styles.championText}>
                <h1 className={styles.championName}>{champion.name}</h1>
                <p className={styles.championTitle}>{champion.title.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <CloseModalButton onClose={onClose}></CloseModalButton>
        </div>
        {activeTab === "resumen" && (
          <ResumenTab
            champion={champion}
            championImg={championImg}
            isChampionInCollection={isChampionInCollection}
            onUnlockChampion={handleUnlockChampion}
          />
        )}
        {activeTab === "aspectos" && (
          <AspectosTab champion={champion} activeTab={activeTab} />
        )}
        {activeTab === "habilidades" && <HabilidadesTab champion={champion} />}
      </div>
    </div>
  ), document.body);
};

export default memo(ChampionDetailModal);
