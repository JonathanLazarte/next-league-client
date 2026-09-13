import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUser } from '@/redux/slices/userSlice'


export const saveSettings = createAsyncThunk<
  Record<string, unknown> | undefined,
  {
    userId: string,
    settings: Record<string, unknown>
  },
  { rejectValue: string }
  >(
  'settings/saveSettings',
  async ( { userId, settings }, { rejectWithValue } ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/v1/user/save-settings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId, settings })
      })

      if (!response.ok) return rejectWithValue('fetch failed')

      //const data = response.json()
      return settings

    } catch (error) {
      rejectWithValue(String(error))
    }
  })

interface SoundSettings {
  master: { volume: number; muted: boolean; };
  sfx: { volume: number; muted: boolean; };
  music: { volume: number; muted: boolean; };
}


export interface VolumePayload {
  type: 'master' | 'sfx' | 'music';
  volume: number;
}

interface MutePayload {
  type: 'master' | 'sfx' | 'music';
  muted: boolean;
}


interface SettingsState {
  loading: boolean;
  error: string | null; // Cambia a string | null
  language: string;
  sound: SoundSettings; // Usa la interfaz definida
  theme: 'light' | 'dark';
}


const initialState: SettingsState = {
  loading: false,
  error: null,
  language: 'es',
  sound: {
    master: { volume: 1, muted: false },
    sfx: { volume: 3, muted: false },
    music: { volume: 0.5, muted: false }
  },
  theme: 'dark',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'es' | 'en'>) => {
      state.language = action.payload;
    },
    setVolume: (state, action: PayloadAction<VolumePayload>) => {
      const { type, volume } = action.payload;
      if (state.sound[type]) {
        state.sound[type].volume = volume;
      }
    },
    setMute: (state, action: PayloadAction<MutePayload>) => {
      const { type, muted } = action.payload;
      if (state.sound[type]) {
        state.sound[type].muted = muted;
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<{ userData: { settings: { sound: SoundSettings }} }>) => {
      state.sound = action.payload.userData.settings.sound;
      state.loading = false;
      state.error = null;
    })
    .addCase(saveSettings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(saveSettings.fulfilled, (state, action) => {
      Object.assign(state, action.payload);

      // posible a futuro:
      // state.theme         = action.payload.theme;
      // state.language      = action.payload.language;
      // state.notifications = action.payload.notifications;
      // ... etc

      state.loading = false;
      state.error = null
    })
    .addCase(saveSettings.rejected, (state, action) => {
      state.loading = false;

      if (action.payload) {
        state.error = action.payload || 'Error al guardar';
      } else {
        state.error = 'Error desconocido';
      }
    });
}
});

export const { setLanguage, setVolume, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
