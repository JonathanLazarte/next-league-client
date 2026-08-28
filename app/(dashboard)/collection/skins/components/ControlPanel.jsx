import { memo } from "react";
import TotalSkinsCount from "./TotalSkinsCount";
import RaritySkinsCount from "./RaritySkinCount";

const ControlPanel = memo(function ControlPanel({ userSkinsCount, userSkinsFull, trigger }) {
    return (
        <div className="control-panel">
            <TotalSkinsCount count={userSkinsCount} />
            <RaritySkinsCount trigger={trigger} userSkinsFull={userSkinsFull} />
        </div>
    );
});

export default ControlPanel;
