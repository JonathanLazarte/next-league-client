import { audioEngine } from '@/engine/audioEngine';


export function useSound(url: string, type = 'sfx') {
  const play = async () => {
    // 1. Nos aseguramos de inicializar si no se ha hecho
    audioEngine.init();
    const { context, channels, cache } = audioEngine;

    // Si no hay contexto (ej: en el servidor), abortamos silenciosamente
    if (!context) return;

    if (context.state === 'suspended') await context.resume();

    try {
      let buffer;
      if (cache.has(url)) {
        buffer = cache.get(url);
      } else {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        buffer = await context.decodeAudioData(arrayBuffer);
        cache.set(url, buffer);
      }

      const source = context.createBufferSource();
      source.buffer = buffer;

      // CONEXIÓN DINÁMICA: Se conecta al canal indicado (sfx o music)
      const targetNode = channels[type].node || channels.master.node;
      source.connect(targetNode);

      source.start(0);
    } catch (error) {
      console.error("Error reproduciendo audio:", error);
    }
  };

  return { play };
}
