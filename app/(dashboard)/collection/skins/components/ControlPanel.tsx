import { memo } from "react";
import TotalSkinsCount from "./TotalSkinsCount";
import RaritySkinsCount from "./RaritySkinCount";

interface ControlPanelProps {
    userSkinsCount: number;
    userSkinsFull: string[];
    trigger: () => void;
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
