import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { saveSettings, setLanguage, setTheme, setVolume } from "@/redux/slices/settingsSlice";

export function useSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  return {
    ...settings,
    settings,
    saveSettings: (payload) => dispatch(saveSettings(payload)),
    setLanguage: (payload) => dispatch(setLanguage(payload)),
    setTheme: (payload) => dispatch(setTheme(payload)),
    setSettingsVolume: (payload) => dispatch(setVolume(payload)),
  };
}
