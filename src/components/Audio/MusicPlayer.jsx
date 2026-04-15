// components/Audio/MusicPlayer.jsx
'use client';
import { useEffect } from 'react';
import { audioEngine } from '@/engine/audioEngine';
import { useSelector } from 'react-redux'

export default function MusicPlayer() {
  const { master, music, sfx, currentTrack } = useSelector(state => state.sound);

  // 1. Reaccionar a cambios de Música (Volumen/Mute)
  useEffect(() => {
    audioEngine.setVolume('master', master.volume);
  }, [master.volume]);
  useEffect(() => {
    audioEngine.setMute('master', master.muted);
  }, [master.muted]);

  useEffect(() => {
    audioEngine.setVolume('music', music.volume);
  }, [music.volume]);
  useEffect(() => {
    audioEngine.setMute('music', music.muted);
  }, [music.muted]);

  useEffect(() => {
    audioEngine.setVolume('sfx', sfx.volume);
  }, [sfx.volume]);
  useEffect(() => {
    audioEngine.setMute('sfx', sfx.muted);
  }, [sfx.muted]);

  // 3. Reaccionar al cambio de pista
  useEffect(() => {
    if (currentTrack) {
      audioEngine.playMusic(currentTrack);
    } else {
      audioEngine.stopMusic();
    }
  }, [currentTrack]);

  return null;
}