import { useDispatch, useSelector } from "react-redux";
import { saveSettings, setLanguage, setTheme, setVolume } from "@/redux/slices/settingsSlice.ts";

export function useSettings() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);

  return {
    ...settings,
    settings,
    saveSettings: (payload) => dispatch(saveSettings(payload)),
    setLanguage: (payload) => dispatch(setLanguage(payload)),
    setTheme: (payload) => dispatch(setTheme(payload)),
    setSettingsVolume: (payload) => dispatch(setVolume(payload)),
  };
}
