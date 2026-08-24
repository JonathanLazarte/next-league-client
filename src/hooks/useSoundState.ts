import { useDispatch } from "react-redux";
import { useAppSelector } from '@/hooks/hooks'
import { useCallback } from "react";
import {
  playTrack,
  restoreDefaults,
  setMute,
  setVolume,
  stopTrack,
  switchTrack,
} from "@/redux/slices/soundSlice";

export function useSoundState() {
  const dispatch = useDispatch();
  const sound = useAppSelector((state) => state.sound);
  const updateVolume = useCallback((payload) => dispatch(setVolume(payload)), [dispatch]);
  const updateMute = useCallback((payload) => dispatch(setMute(payload)), [dispatch]);
  const restoreSoundDefaults = useCallback(() => dispatch(restoreDefaults()), [dispatch]);
  const startTrack = useCallback((payload) => dispatch(playTrack(payload)), [dispatch]);
  const stopCurrentTrack = useCallback(() => dispatch(stopTrack()), [dispatch]);
  const changeTrack = useCallback((payload) => dispatch(switchTrack(payload)), [dispatch]);

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
