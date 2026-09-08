import "./Settings.css";
import { audioEngine } from "@/engine/audioEngine.js";
import ReactDOM from "react-dom";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import { useSoundState } from "@/hooks/useSoundState";
import { useSettings } from "@/hooks/useSettings";

function SoundControl({ label, checkLabel, type, isMasterMuted }) {
  // Estado local solo para visualización inmediata en UI
  const [localVolume, setLocalVolume] = useState(0.5); // Valor inicial debería venir de config
  const [isLocalMuted, setIsLocalMuted] = useState(false);
  const soundState = useSoundState();
  const { volume: globalVolume, muted: globalMuted } = soundState[type];

  const handleSlider = (e) => {
    const val = e.target.value;
    audioEngine.setVolume(type, val);
    setLocalVolume(val);
  };
  const handleCommit = (e) => {
    const val = e.target.value;
    soundState.setVolume({ type, val });
  };

  const handleCheck = () => {
    soundState.setMute({ type, muted: !isLocalMuted });
  };

  useEffect(() => setLocalVolume(globalVolume), [globalVolume]);
  useEffect(() => setIsLocalMuted(globalMuted), [globalMuted]);

  return (
    <div
      className={`master-sound-control ${isLocalMuted || isMasterMuted ? "muted" : null}`}
    >
      <div className="settings-checkbox">
        <div
          className="custom-checkbox"
          onClick={handleCheck}
          style={isMasterMuted ? { pointerEvents: "none" } : null}
        >
          {!isLocalMuted && (
            <FaCheck
              className="check-icon"
              style={isMasterMuted && { opacity: "0.5" }}
            />
          )}
        </div>
        <label className="audio-label">Enable {checkLabel}</label>
      </div>
      <div className="sub-volume-controls">
        <span className={`audio-label `}>
          {label}
          {parseInt(
            (globalVolume * 100) / audioEngine.channels[type].maxVolume,
          )}
        </span>
        <input
          type="range"
          min="0"
          max={audioEngine.channels[type].maxVolume}
          step="0.01"
          value={localVolume}
          onChange={handleSlider}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          disabled={isLocalMuted || isMasterMuted} // Opcional: Desactivar slider si está muteado
          className={`audio-input`}
        />
      </div>
    </div>
  );
}

// Componente de Ajustes de Sonido
function AudioSettings() {
  const [localVolume, setLocalVolume] = useState(0.5); // Valor inicial debería venir de config
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const soundState = useSoundState();
  const { volume: globalVolume, muted: globalMuted } = soundState.master;

  const handleSlider = (e) => {
    const val = e.target.value;
    audioEngine.setVolume("master", val);
    setLocalVolume(val);
  };
  const handleCommit = (e) => {
    const val = e.target.value;
    soundState.setVolume({ type: "master", val });
  };

  const handleCheck = () => {
    soundState.setMute({ type: "master", muted: !isMasterMuted });
  };

  useEffect(() => setLocalVolume(globalVolume), [globalVolume]);
  useEffect(() => setIsMasterMuted(globalMuted), [globalMuted]);

  return (
    <div className="audio-settings">
      <div className={`master-sound-control ${isMasterMuted ? "muted" : null}`}>
        <div className="settings-checkbox">
          <div className="custom-checkbox" onClick={handleCheck}>
            {!isMasterMuted && (
              <FaCheck
                className="check-icon"
                style={isMasterMuted && { opacity: "0.5" }}
              />
            )}
          </div>
          <label className="audio-label">Enable Sound</label>
        </div>
        <span className="audio-label">
          Overall Volume: {parseInt(globalVolume * 100)}
        </span>
        <input
          type="range"
          value={localVolume}
          min="0"
          max="1"
          step="0.01"
          onChange={handleSlider}
          onMouseUp={handleCommit}
          onTouchEnd={handleCommit}
          disabled={isMasterMuted} // Opcional: Desactivar slider si está muteado
          className="audio-input"
        />
      </div>

      <div className="secondary-controls">
        <SoundControl
          label="SFX Volume: "
          checkLabel={"SFX"}
          type="sfx"
          isMasterMuted={isMasterMuted}
        />
        <SoundControl
          label="Music Volume: "
          checkLabel={"Music"}
          type="music"
          isMasterMuted={isMasterMuted}
        />
      </div>
    </div>
  );
}

export default function Settings({ setIsSettingsOpen }) {
  const [settingSelected, setSettingSelected] = useState("sound");
  const { settings, saveSettings } = useSettings();
  const { restoreDefaults } = useSoundState();

  const handleRestoreDefaults = () => {
    restoreDefaults();
  };
  const handleSaveSettings = () => {
    const updatedUserSettings = {
      ...settings,
      sound: {
        master: {
          volume: audioEngine.channels.master.volume,
          muted: audioEngine.channels.master.muted,
        },
        sfx: {
          volume: audioEngine.channels.sfx.volume,
          muted: audioEngine.channels.sfx.muted,
        },
        music: {
          volume: audioEngine.channels.music.volume,
          muted: audioEngine.channels.music.muted,
        },
      },
    };
    const token = localStorage.getItem("token");
    saveSettings({ userId: token, settings: updatedUserSettings });
  };
  return (
    typeof window !== "undefined" &&
    ReactDOM.createPortal(
      <div className="settings-modal">
        <div className="settings-panel">
          <div className="settings-header">
            <div className="settings-header-tittle">
              <span>CLIENT</span>
              <span style={{ marginLeft: "1rem", marginRight: "1rem" }}>/</span>
              <span style={{ color: "var(--gold-one)" }}>
                {settingSelected.toUpperCase()}
              </span>
            </div>
            <div
              className="settings-restore-button general-button"
              onClick={() => handleRestoreDefaults()}
            >
              Restore Defaults
            </div>
          </div>
          <div className="settings-main">
            <div className="settings-category-selector">
              <div
                className={`setting-category-item ${settingSelected === "sound" ? "selected" : null}`}
                onClick={() => setSettingSelected("SOUND")}
              >
                <div className="selected-reference-bar"></div>
                <div className="setting-category-item-name">SOUND</div>
              </div>
            </div>
            <div className="settings-parameters">
              {settingSelected === "sound" && <AudioSettings />}
            </div>
          </div>
          <div
            className="general-button"
            onClick={() => {
              handleSaveSettings();
              setIsSettingsOpen(false);
            }}
          >
            DONE
          </div>
        </div>
      </div>,
      document.body,
    )
  );
}
