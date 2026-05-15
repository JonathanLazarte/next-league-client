// engine/audioEngine.js

class AudioEngine {
  constructor() {
    this.context = null;
    //eslint-disable-next-line no-undef
    this.cache = new Map();

    this.musicElement = null;
    this.musicSource = null;
    this.channels = {
      master: { node: null, volume: 1.0, maxVolume: 1.0, muted: false },
      sfx: { node: null, volume: 2.0, maxVolume: 2.0, muted: false },
      music: { node: null, volume: 0.5, maxVolume: 1.0, muted: false }
    };
  }

  // Este método es la clave: solo se ejecuta en el cliente
  init() {
    if (typeof window === "undefined" || this.context) return;

    // ... Creación del contexto
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioCtx();

    // 1. Crear nodos y asignarlos a la estructura de canales
    this.channels.master.node = this.context.createGain();
    this.channels.sfx.node = this.context.createGain();
    this.channels.music.node = this.context.createGain();

    // 2. Conectar (Music/SFX -> Master -> Destination)
    this.channels.sfx.node.connect(this.channels.master.node)
    this.channels.music.node.connect(this.channels.master.node)


    this.channels.master.node.connect(this.context.destination);

    // 3. Aplicar volúmenes iniciales
    this.updateNode('master');
    this.updateNode('music');
    this.updateNode('sfx');

  }

  // Función interna para aplicar el cambio real al nodo
  updateNode(type) {
    const channel = this.channels[type];
    if (!channel.node) return;

    // Si está muteado es 0, si no, es su volumen guardado
    const targetValue = channel.muted ? 0 : channel.volume;
    
    channel.node.gain.setTargetAtTime(targetValue, this.context.currentTime, 0.05);
  }

  // Cuando el usuario mueve el Slider
  setVolume(type, value) {
    /*const node = this.channels[type]?.node;
    if (node) {
      node.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
    }*/
    this.channels[type].volume = parseFloat(value);
    // Solo actualizamos el nodo si NO está muteado (o si quieres reactividad inmediata)
    // Generalmente queremos actualizar igual para que recalcule
    this.updateNode(type);
  }

  // Cuando el usuario toca el Checkbox
  setMute(type, mute) {
    this.channels[type].muted = mute;
    this.updateNode(type);
    return this.channels[type].muted; // Devolvemos el estado para la UI
  }
//---------------------------------------------------------------------------------
  playMusic(url) {
    // 1. Verificación de seguridad
    if (typeof window === "undefined") return;
    
    // 2. Autoinicialización: Si alguien olvida llamar a init(), lo hacemos aquí
    if (!this.context) this.init();

    // 3. Primer inicio: Crear el elemento y "cablearlo"
    if (!this.musicElement) {
      this.musicElement = new Audio(url);
      this.musicElement.loop = true;
      
      // Conexión única a la cadena de nodos
      this.musicSource = this.context.createMediaElementSource(this.musicElement);
      this.musicSource.connect(this.channels.music.node);
    } 
    // 4. Cambio de canción: Si el elemento ya existe pero la URL es otra
    else if (this.musicElement.src !== url) {
      // Importante: No creamos un nuevo 'source', solo cambiamos el archivo del disco
      this.musicElement.src = url;
      this.musicElement.load();
    }

    // 5. Reproducción
    this.musicElement.play().catch((/*e*/) => {
        console.warn("Autoplay bloqueado: El usuario debe interactuar primero.");
    });
  }

  stopMusic() {
    if (this.musicElement) {
      this.musicElement.pause();
      this.musicElement.currentTime = 0; // Reinicia la pista
    }
  }

  // Opcional: para el Logout completo
  destroyMusic() {
    this.stopMusic();
    this.musicElement = null;
    // Nota: musicSource no se puede desconectar fácilmente en algunos navegadores,
    // pero al setear musicElement a null liberamos el control.
  }
//--------------------------------------------------------------------------------
}

// Exportamos una única instancia vacía
export const audioEngine = new AudioEngine();