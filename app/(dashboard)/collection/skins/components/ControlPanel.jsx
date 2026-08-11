import { memo } from "react";
import TotalSkinsCount from "./TotalSkinsCount";
import RaritySkinsCount from "./RaritySkinCount";

const ControlPanel = memo(function ControlPanel({ userSkinsCount, userSkinsFull, trigger }) {
    return (
        <div className="control-panel">
            <img src="/collection/control-panel-frame-top.png" className="control-panel-frame-top" alt="" />
            <TotalSkinsCount count={userSkinsCount} />
            <RaritySkinsCount trigger={trigger} userSkinsFull={userSkinsFull} />
            <img src="/collection/control-panel-frame-bot.png" className="control-panel-frame-bot" alt="" />
        </div>
    );
});

export default ControlPanel;
