import { createSlice/*, createAsyncThunk*/ } from '@reduxjs/toolkit'

interface Node {
  volume: number,
  muted: boolean
}

interface SoundState {
  currentTrack: string,
  master: Node,
  sfx: Node,
  music: Node,
}

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
		setVolume: (state, action) => {
			let { type, val } = action.payload
			state[type].volume = val
		},
		setMute: (state, action) => {
			let { type, muted } = action.payload
			state[type].muted = muted
		},
		restoreDefaults: () => initialState,
		playTrack: (state, action) => {
			state.currentTrack = action.payload
		},
		stopTrack: (state) => {
			state.currentTrack = null;
		},
		switchTrack: (state, action) => {
			state.currentTrack = action.payload
		}
	}
})

export const { setVolume, setMute, restoreDefaults, playTrack, stopTrack, switchTrack } = soundSlice.actions
export default soundSlice.reducer
