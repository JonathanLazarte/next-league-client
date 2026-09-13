import { createSlice,/*, createAsyncThunk*/
PayloadAction} from '@reduxjs/toolkit'

export interface Node {
  volume: number,
  muted: boolean
}

export interface SoundState {
  currentTrack: string | null,
  master: Node,
  sfx: Node,
  music: Node,
}

export type SoundOptions = "master" | "sfx" | "music"

const initialState: SoundState = {
	currentTrack: '/music/Xin Zhao.mp3',
	master: { volume: 1, muted: false },
	sfx: { volume: 1, muted: false },
	music: {volume: 0.5, muted: false }
}

const soundSlice = createSlice({
	name: 'sound',
	initialState,
	reducers: {
    setVolume: (state, action: PayloadAction<{ type: SoundOptions, val: number }>) => {
			const { type, val } = action.payload
			state[type].volume = val
		},
		setMute: (state, action: PayloadAction<{ type: SoundOptions, muted: boolean }>) => {
			const { type, muted } = action.payload
			state[type].muted = muted
		},
		restoreDefaults: () => initialState,
		playTrack: (state, action: PayloadAction<string>) => {
			state.currentTrack = action.payload
		},
		stopTrack: (state) => {
			state.currentTrack = null;
		},
		switchTrack: (state, action: PayloadAction<string>) => {
			state.currentTrack = action.payload
		}
	}
})

export const { setVolume, setMute, restoreDefaults, playTrack, stopTrack, switchTrack } = soundSlice.actions
export default soundSlice.reducer
