import { useState, useRef, useCallback } from "react";
import useHoverIntent from "@/hooks/useHoverIntent";
import { HOVER_DELAYS } from "@/utils/constants";
import type { Skin } from "@/utils/types"

export function useSkinHoverTooltip() {
    const tooltipRef = useRef();
    const tooltipPosRef = useRef({ x: 0, y: 0 });
    const [hoveredSkin, setHoveredSkin] = useState(null);
    const [hoveredSkinCardRef, setHoveredSkinCardRef] = useState<React.RefObject<HTMLDivElement> | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const { start, cancel, end, currentDelayType } = useHoverIntent({
        initialDelay: HOVER_DELAYS.INITIAL,
        fastDelay: HOVER_DELAYS.FAST,
        resetAfter: HOVER_DELAYS.RESET_AFTER,
    });

    const onHoverStart = useCallback(
        (skin: Skin, skinCardRef: React.RefObject<HTMLDivElement>) => {
            start({
                cb: () => {
                    setTooltipPos(tooltipPosRef.current);
                    setHoveredSkinCardRef(skinCardRef);
                    setHoveredSkin(skin);
                },
                isTooltipOpened: hoveredSkin !== null,
            });
        },
        [start, hoveredSkin]
    );

    const onHoverEnd = useCallback(() => {
        end(() => setHoveredSkin(null));
        cancel();
    }, [cancel, end]);

    const handleScroll = useCallback(() => {
        if (hoveredSkin) setHoveredSkin(null);
    }, [hoveredSkin]);

    return {
        hoveredSkin,
        hoveredSkinCardRef,
        tooltipPos,
        tooltipPosRef,
        tooltipRef,
        currentDelayType,
        onHoverStart,
        onHoverEnd,
        handleScroll,
    };
}
