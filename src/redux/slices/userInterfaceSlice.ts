import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

type UserState = "online" | "offline" | "ingame" | "away" | string
type Section = "home" | "matchmaking" | "lobby" | "champselect" | "game" | "play" | "store" | "collection"
type Queue = "solo_duo" | "flex" | "aram" | null | "aram_mayhem" | "tutorial" | "swiftplay"

interface UserInterfaceState {
  userState: UserState;
  actualSection: Section;
  isNavigating: boolean;
  queue: Queue;
  queueStatus: string;
  searchTime: number;
  lobbyId: number | null;
  partyMembers: [];
  inChampionSelect: boolean;
  selectedChampion: number | null;
  inGame: boolean;
  gameId: number | null;
  notifications: [];
  modal: null;
}

const initialState: UserInterfaceState = {
  // Estado del usuario
  userState: "online", // online | away | inGame | offline

  // Navegación
  actualSection: "home",
  isNavigating: false,

  // Matchmaking
  queue: null, // SoloQ, Flex, ARAM, etc.
  queueStatus: "idle", // idle | searching | found | accepted
  searchTime: 0,

  // Lobby
  lobbyId: null,
  partyMembers: [],

  // Champ Select
  inChampionSelect: false,
  selectedChampion: null,

  // Partida
  inGame: false,
  gameId: null,

  // Notificaciones
  notifications: [],

  // Modal global
  modal: null,
};

const userInterfaceSlice = createSlice({
  name: "userInterface",
  initialState,
  reducers: {
    setActualSection: (state, action) => {
      state.actualSection = action.payload;
    },
    setUserState: (state, action: PayloadAction<UserState>) => {
      state.userState = action.payload;
    },
    setIsNavigating: (state, action) => {
      state.isNavigating = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    setQueueStatus: (state, action) => {
      state.queueStatus = action.payload
    }
  },
});

export const {
  setActualSection,
  setUserState,
  setIsNavigating,
  setQueueStatus
} = userInterfaceSlice.actions;

export const selectUserInterfaceActualSection = (state) =>
  state.userInterface.actualSection;
export const selectUserInterfaceState = (state) =>
  state.userInterface.userState;
export const selectUserInterfaceIsNavigating = (state) =>
  state.userInterface.isNavigating;
export const selectQueueStatus = (state) =>
  state.userInterface.queueStatus;

export const selectUserInterfaceData = createSelector(
  [
    selectUserInterfaceState,
    selectUserInterfaceActualSection,
    selectUserInterfaceIsNavigating,
    selectQueueStatus
  ],
  (userState, actualSection, isNavigating, queueStatus) => ({
    userState,
    actualSection,
    isNavigating,
    queueStatus
  }),
);

export default userInterfaceSlice.reducer;
