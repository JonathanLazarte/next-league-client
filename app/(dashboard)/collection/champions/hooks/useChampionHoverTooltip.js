import useHoverIntent from "@/hooks/useHoverIntent";
import { HOVER_DELAYS } from "@/utils/constants.js";
import { useState, useCallback } from "react";
import { useRef } from "react";

export default function useChampionHoverTooltip() {
    const [hoveredChampion, setHoveredChampion] = useState(null);
    const tooltipRef = useRef();
    const tooltipPosRef = useRef({ x: 0, y: 0, rect: null });
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [activeChampionRef, setActiveChampionRef] = useState(null);
    const { start, cancel, end, currentDelayType } = useHoverIntent({
        initialDelay: HOVER_DELAYS.INITIAL,
        fastDelay: HOVER_DELAYS.FAST,
        resetAfter: HOVER_DELAYS.RESET_AFTER,
    });

    const handleScroll = useCallback(() => {
        if (hoveredChampion) setHoveredChampion(null);
    }, [hoveredChampion]);

    const onHoverStart = (champion, championCardRef) => {
        start({
            cb: () => {
                setActiveChampionRef(championCardRef);
                setTooltipPos(tooltipPosRef.current);
                setHoveredChampion(champion);
            },
            isTooltipOpened: hoveredChampion !== null,
        });
    };
    const onHoverEnd = useCallback(() => {
        end(() => setHoveredChampion(null));
        cancel();
        /*probar pasar sethoveredchampion por prop en cancel()*/
    }, [cancel, end]);

    return {
        onHoverEnd,
        onHoverStart,
        hoveredChampion,
        tooltipRef,
        tooltipPosRef,
        tooltipPos,
        activeChampionRef,
        handleScroll,
        currentDelayType,
        cancel,
        setHoveredChampion
    }
}