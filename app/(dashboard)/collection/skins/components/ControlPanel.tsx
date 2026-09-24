import { memo } from "react";
import TotalSkinsCount from "./TotalSkinsCount";
import RaritySkinsCount from "./RaritySkinCount";
import { Skin } from "@/types/skin";

type TooltipTrigger = ({ content }: { content: string; }) => {
  ref: React.MutableRefObject<null>;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

interface ControlPanelProps {
    userSkinsCount: number;
    userSkinsFull: Skin[];
    trigger: TooltipTrigger;
}

const ControlPanel = memo(function ControlPanel({ userSkinsCount, userSkinsFull, trigger }: ControlPanelProps) {
    return (
        <div className="control-panel">
            <TotalSkinsCount count={userSkinsCount} />
            <RaritySkinsCount trigger={trigger} userSkinsFull={userSkinsFull} />
        </div>
    );
});

export default ControlPanel;
