import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export const saveSettings = createAsyncThunk(
  'settings/saveSettings',
  async ( { userId, settings }, { rejectWithValue } ) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}pokemons/users/saveSettings`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ userId, settings })
      }).then(response => response.json)

      if (!response.ok) return rejectWithValue('fetch failed')

      return response

    } catch (error) {
      rejectWithValue(error.message)
    }
  })

interface SettingsState {
  loading: boolean;
  error: string;
  language: string;
  sound: object;
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
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setVolume: (state, action: PayloadAction<object>) => {
      state.volume = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
  builder
    .addCase(saveSettings.pending, (state) => {
      state.loading = true;
      state.error = null;           // opcional: limpiar error previo
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
        state.error = (action.payload as any)?.message || 'Error al guardar';
      } else {
        state.error = action.error.message || 'Error desconocido';
      }
    });
}
});

export const { setLanguage, setVolume, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;
