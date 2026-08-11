import { useState, useRef, useCallback } from "react";
import useHoverIntent from "@/hooks/useHoverIntent";
import { HOVER_DELAYS } from "@/utils/constants";

export function useSkinHoverTooltip() {
    const tooltipRef = useRef();
    const toolTipPosRef = useRef({ x: 0, y: 0 });
    const [hoveredSkin, setHoveredSkin] = useState(null);
    const [hoveredSkinCardRef, setHoveredSkinCardRef] = useState(null);
    const [toolTipPos, setToolTipPos] = useState({ x: 0, y: 0 });

    const { start, cancel, end, currentDelayType } = useHoverIntent({
        initialDelay: HOVER_DELAYS.INITIAL,
        fastDelay: HOVER_DELAYS.FAST,
        resetAfter: HOVER_DELAYS.RESET_AFTER,
    });

    const onHoverStart = useCallback(
        (skin, skinCardRef) => {
            start({
                cb: () => {
                    setToolTipPos(toolTipPosRef.current);
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
        toolTipPos,
        toolTipPosRef,
        tooltipRef,
        currentDelayType,
        onHoverStart,
        onHoverEnd,
        handleScroll,
    };
}
