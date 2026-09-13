import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { saveSettings, setLanguage, setTheme, setVolume } from "@/redux/slices/settingsSlice";
import type { VolumePayload } from '@/redux/slices/settingsSlice';

export function useSettings() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);

  return {
    ...settings,
    settings,
    saveSettings: (payload: { userId: string, settings: Record<string, unknown> }) => dispatch(saveSettings(payload)),
    setLanguage: (payload: 'es' | 'en') => dispatch(setLanguage(payload)),
    setTheme: (payload: 'light' | 'dark') => dispatch(setTheme(payload)),
    setSettingsVolume: (payload: VolumePayload) => dispatch(setVolume(payload)),
  };
}
