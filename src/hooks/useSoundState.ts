import { useAppSelector, useAppDispatch } from '@/hooks/hooks'
import { useCallback } from "react";
import {
  playTrack,
  restoreDefaults,
  setMute,
  setVolume,
  stopTrack,
  switchTrack,
} from "@/redux/slices/soundSlice";
import type { SoundOptions } from "@/redux/slices/soundSlice";

export function useSoundState() {
  const dispatch = useAppDispatch();
  const sound = useAppSelector((state) => state.sound);

  const updateVolume = useCallback((payload: { type: SoundOptions, val: number }) => dispatch(setVolume(payload)), [dispatch]);
  const updateMute = useCallback((payload: { type: SoundOptions, muted: boolean }) => dispatch(setMute(payload)), [dispatch]);
  const restoreSoundDefaults = useCallback(() => dispatch(restoreDefaults()), [dispatch]);
  const startTrack = useCallback((payload: string) => dispatch(playTrack(payload)), [dispatch]);
  const stopCurrentTrack = useCallback(() => dispatch(stopTrack()), [dispatch]);
  const changeTrack = useCallback((payload: string) => dispatch(switchTrack(payload)), [dispatch]);

  return {
    ...sound,
    sound,
    setVolume: updateVolume,
    setMute: updateMute,
    restoreDefaults: restoreSoundDefaults,
    playTrack: startTrack,
    stopTrack: stopCurrentTrack,
    switchTrack: changeTrack,
  };
}
