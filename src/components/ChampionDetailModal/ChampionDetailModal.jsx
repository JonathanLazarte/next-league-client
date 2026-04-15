'use client'

import React, { useState, useEffect, memo } from 'react';
import { IoClose } from "react-icons/io5";
import { IoArrowForward } from "react-icons/io5";
import styles from './ChampionDetailModal.module.css';
import './ChampionDetailModal.css';
import { openPurchaseModal } from '@/redux/slices/purchaseSlice.js'
import { useSelector, useDispatch } from 'react-redux'
import { selectUserChampionsData } from '@/redux/slices/userChampionsSlice.js';
import { selectUserSkinsData } from '@/redux/slices/userSkinsSlice.js';
/*aspectos imports*/
import { GiStripedSword } from "react-icons/gi";
import { GrVulnerability } from "react-icons/gr";
import { LuSwords } from "react-icons/lu";
import { GiShield } from "react-icons/gi";
import { PiSpiralBold } from "react-icons/pi";
import { GiMetalBoot } from "react-icons/gi";
import { IoMdTrophy } from "react-icons/io";
import { GiPadlock } from "react-icons/gi";

const ResumenTab = memo(function ResumenTab({
    champion,
    championImg,
    isChampionInCollection,
    onUnlockChampion,
}) {
    const difficulty = champion?.info.difficulty;

    return (
        <div style={{ backgroundImage: championImg }} className={styles.content}>
            {/* Left Panel - Information */}
            <div className={styles.leftPanel}>
                <div className={styles.graphics}>
                    <div className={styles.info}>
                        <div className={styles.damageType}>
                            <span className={styles.damageLabel}>DAÑO:</span>
                            <span className={styles.damageValue}>Mixto</span>
                        </div>
                        <div className={styles.styleSection}>
                            <span className={styles.styleLabel}>ESTILO:</span>
                            <div className={styles.styleSlider}>
                                <span className={styles.meleeIcon}><GiStripedSword /></span>
                                <div className={styles.sliderTrack}>
                                    <div className={styles.sliderThumb} style={{ left: '40%' }}></div>
                                </div>
                                <span className={styles.rangedIcon}><GrVulnerability /></span>
                            </div>
                        </div>
                        <div className={styles.difficultySection}>
                            <span className={styles.difficultyLabel}>DIFICULTAD:</span>
                            <div className={styles.difficultyBar}>
                                <div className={styles.difficultyLevelOne}></div>
                                {difficulty > 4 ? <div className={styles.difficultyLevelTwo}></div> : null}
                                {difficulty > 7 ? <div className={styles.difficultyLevelThree}></div> : null}
                            </div>
                        </div>
                    </div>
                    <div className={styles.statsRadar}>
                        <div className={styles.radarChart}>
                            {[
                                { name: 'Ataque', value: 13, icon: <LuSwords /> },
                                { name: 'Defensa', value: 13, icon: <GiShield /> },
                                { name: 'Utilidad', value: 13, icon: <PiSpiralBold /> },
                                { name: 'Magia', value: 13, icon: <IoMdTrophy /> },
                                { name: 'Movilidad', value: 13, icon: <GiMetalBoot /> },
                            ].map((stat, index) => {
                                const maxStatValue = 10;
                                const angle = (index * 60) * (Math.PI / 180);
                                const radius = (stat.value / maxStatValue) * 60;
                                const x = 80 + radius * Math.cos(angle);
                                const y = 80 + radius * Math.sin(angle);

                                return (
                                    <div key={stat.name} className={styles.statPoint} style={{ left: x, top: y }}>
                                        <span className={styles.statIcon}>{stat.icon}</span>
                                    </div>
                                );
                            })}
                            <div className={styles.radarBackground}></div>
                        </div>
                    </div>
                </div>
                <div className={styles.loreSection}>
                    <p className={styles.loreText}>
                        Entre los secretos guerreros jonios conocidos como los Kinkou, Shen sirve como su líder, el Ojo del Crepúsculo. Desea mantenerse libre de las confusiones que provocan la emoción, los prejuicios y el ego, y camina por la senda oculta del juicio imparcial entre el mundo espiritual y el mundo real. Al estar encargado del balance entre ellos, Shen blande hojas de acero y energía arcana contra cualquiera que lo amenace.
                    </p>
                </div>
                <div className={styles.actionButtons}>
                    {isChampionInCollection ? (
                        <button className="general-button disabled">
                            EN COLECCIÓN
                        </button>
                    ) : (
                        <button className="general-button" onClick={onUnlockChampion}>
                            DESBLOQUEAR
                        </button>
                    )}
                    <button
                        onClick={() => { window.open(`https://www.leagueoflegends.com/es-es/champions/${champion.id.toLowerCase()}/`, "_blank", "noopener,noreferrer"); }}
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

const AspectosTab = memo(function AspectosTab({
    champion,
    activeTab,
}) {
    const [ selectedSkin, setSelectedSkin ] = useState(0)
    const { userSkins } = useSelector(selectUserSkinsData)
    const totalSkins = champion.skins.length;
    const isSkinInCollection = selectedSkin === 0 || userSkins.some(us => us.key == champion.skins[selectedSkin]?.id);
    const dispatch = useDispatch()
    
    const isThisSkinInCollection = (skinContextIndex) => {
        return skinContextIndex == 0 || userSkins.some(us => us.key == champion.skins[skinContextIndex].id);
    };
    const handleUnlockSkin = () => {
        const selectedSkinId = champion?.skins[selectedSkin]?.id
        dispatch(openPurchaseModal({ itemId: selectedSkinId, type: "skin" }))
    }
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
    };

    const goToNextSkin = () => {
        setSelectedSkin((prev) => (prev + 1) % totalSkins);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (activeTab === 'aspectos') {
                switch (event.key) {
                    case 'ArrowLeft':
                        event.preventDefault();
                        goToPreviousSkin();
                        break;
                    case 'ArrowRight':
                        event.preventDefault();
                        goToNextSkin();
                        break;
                    default:
                        break;
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, selectedSkin, totalSkins]);

    const visibleSkins = getVisibleSkins();

    return (
        <div className="content" style={{ backgroundImage: `url(/${window.innerWidth < 767 ? 'loading' : 'splash'}/${champion.id}_${champion.skins[selectedSkin].num}.jpg)` }}>
            <div className="bottom-panel">
                <h3 className="skin-name"> {selectedSkin != 0 ? champion.skins[selectedSkin].name : champion.name} </h3>
                <div className="skin-navigator">
                    <div className="navigator-line"></div>
                    <div className="minibuttons-container">
                        {champion.skins.map((_, index) =>
                        (<div key={index} onClick={() => setSelectedSkin(index)} className={`navigator-minibutton ${index == selectedSkin ? 'active' : null}`}></div>))}
                    </div>
                    <div className="navigator-line"></div>
                </div>
                <div className="actions">
                    {isSkinInCollection ? <div className="unlock-button disabled"> EN COLECCION </div> : <div className="unlock-button" onClick={handleUnlockSkin}> DESBLOQUEAR </div>}
                    <div className="skin-changer">
                        <div className="skin-minicards-container">
                            {visibleSkins.map((skinIndex, position) => (
                                <div
                                    key={`${skinIndex}-${position}`}
                                    onClick={() => skinIndex !== null && setSelectedSkin(skinIndex)}
                                    className={`skin-minicard ${skinIndex === selectedSkin ? 'selected' : ''} ${skinIndex === null ? 'empty' : ''}`}
                                    style={{
                                        transform: position === 2 && skinIndex !== null ? 'scale(1.1)' : 'scale(1)',
                                        zIndex: position === 2 ? 10 : 5 - Math.abs(position - 2),
                                        transition: 'all 0.3s ease-in-out',
                                        opacity: skinIndex === null ? 0.3 : 1,
                                        cursor: skinIndex === null ? 'default' : 'pointer'
                                    }}
                                    role={skinIndex !== null ? "button" : undefined}
                                    tabIndex={skinIndex !== null ? 0 : -1}
                                    aria-label={skinIndex !== null ? `Skin ${skinIndex + 1} de ${champion.name}` : 'Slot vacío'}
                                    onKeyDown={(e) => {
                                        if (skinIndex !== null && (e.key === 'Enter' || e.key === ' ')) {
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
                                            {!isThisSkinInCollection(skinIndex) ? <GiPadlock className={`locked-icon ${skinIndex === selectedSkin ? 'selected' : ''}`} /> : null}
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
    const spellKeys = ['P', 'Q', 'W', 'E', 'R'];
    const [selectedSpell, setSelectedSpell] = useState(0);

    return (
        <div className="spells-section">
            <video
                src={`https://lol.dyn.riotcdn.net/x/videos/champion-abilities/0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}/ability_0${champion.key.toString().length < 3 ? `0${champion.key}` : champion.key}_${spellKeys[selectedSpell]}1.mp4`}
                autoPlay
                loop
                playsInline
            />
            <div className="spells-panel">
                <div className="sprites-container">
                    <div className="passive-item">
                        <img onClick={() => setSelectedSpell(0)} className={`passive-image ${selectedSpell === 0 ? 'selected' : null}`} src={`/passive/${champion.passive.image.full}`}></img>
                        P
                    </div>
                    <div className="spell-separator"></div>
                    {champion.spells.map((spell, index) => {
                        return <div key={index} className="spell-item">
                            <img key={index} onClick={() => setSelectedSpell(index + 1)} className={`spell-image ${selectedSpell === index + 1 ? 'selected' : null}`} src={`/spell/${spell.image.full}`}></img>
                            {spellKeys[index]}
                        </div>
                    })}
                </div>
                <div className="spell-info">
                    <h3 className="name"> {selectedSpell !== 0 ? champion.spells[selectedSpell - 1].name : champion.passive.name} </h3>
                    <p className="spell-description">{selectedSpell !== 0 ? champion.spells[selectedSpell - 1].description : champion.passive.description}</p>
                </div>
            </div>
        </div>
    );
});

const ChampionDetailModal = ({ champion, onClose }) => {
    const [ activeTab, setActiveTab ] = useState('resumen');
    const { userChampions } = useSelector(selectUserChampionsData)
    const dispatch = useDispatch();

    if (!champion) return null;

    const isChampionInCollection = userChampions?.some(c => c.id == champion.id)
    
    const tabs = window.innerWidth > 767 ? [
        { id: 'resumen', label: 'RESUMEN' },
        { id: 'habilidades', label: 'HABILIDADES' },
        { id: 'maestria', label: 'MAESTRÍA' },
        { id: 'eternos', label: 'ETERNOS' },
        { id: 'aspectos', label: 'ASPECTOS' }
    ] : [
        { id: 'resumen', label: 'RESUMEN' },
        { id: 'habilidades', label: 'HABILIDADES' },
        { id: 'aspectos', label: 'ASPECTOS' }
    ]
    
    const championImg = `url('/${activeTab === 'resumen' ? 'centered' : 'splash'}/${champion.id}_0.jpg')`
    /*const skinFileName = `${champion.id}_`*/
    const handleUnlockChampion = () => {
        dispatch(openPurchaseModal({ itemId: champion.id, type: "champion" }))
    }
    
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal} >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.championInfo}>
                        <div className={styles.championIcon}>
                            <img
                                src={`/tiles/${champion.id}_0.jpg`}
                                alt={champion.name}
                                className={styles.iconImage}
                            />
                        </div>
                        <div className={styles.championText}>
                            <h1 className={styles.championName}>{champion.name}</h1>
                            <p className={styles.championTitle}>EL OJO DEL CREPÚSCULO</p>
                        </div>
                    </div>
                    
                    <div className={styles.tabs}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    
                    <button className={styles.closeButton} onClick={onClose}>
                        <IoClose className="rounded-icon" />
                    </button>
                </div>
                {activeTab === 'resumen' && (
                    <ResumenTab
                        champion={champion}
                        championImg={championImg}
                        isChampionInCollection={isChampionInCollection}
                        onUnlockChampion={handleUnlockChampion}
                    />
                )}
                {activeTab === 'aspectos' && (
                    <AspectosTab
                        champion={champion}
                        activeTab={activeTab}
                    />
                )}
                {activeTab === 'habilidades' && <HabilidadesTab champion={champion} />}
                
            </div>
        </div>
    );
};

export default memo(ChampionDetailModal);