import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

export type UserState = "online" | "offline" | "ingame" | "away" | string
export type Section = "league" | "play" | "store" | "collection" | string
export type Queue = "solo_duo" | "flex" | "aram" | null | "aram_mayhem" | "tutorial" | "swiftplay"
export type QueueStatus = "idle" | "found" | "searching" | "acepted"

interface UserInterfaceState {
  userState: UserState;
  actualSection: Section;
  isNavigating: boolean;
  showSideNav: boolean; // Add this
  sectionTabSelected: string | null; // Add this
  queue: Queue;
  queueStatus: QueueStatus;
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
  showSideNav: true, // Initial state
  sectionTabSelected: null, // Initial state

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
    toggleSideNav: (state) => {
      state.showSideNav = !state.showSideNav;
    },
    setSectionTabSelected: (state, action) => {
      state.sectionTabSelected = action.payload;
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
  toggleSideNav,
  setSectionTabSelected,
  setQueue,
  setQueueStatus
} = userInterfaceSlice.actions;

interface StateProp {
  userInterface: UserInterfaceState
}

export const selectUserInterfaceActualSection = (state: StateProp) =>
  state.userInterface.actualSection;
export const selectUserInterfaceState = (state: StateProp) =>
  state.userInterface.userState;
export const selectUserInterfaceIsNavigating = (state: StateProp) =>
  state.userInterface.isNavigating;
export const selectUserInterfaceShowSideNav = (state: StateProp) =>
  state.userInterface.showSideNav;
export const selectUserInterfaceSectionTabSelected = (state: StateProp) =>
  state.userInterface.sectionTabSelected;
export const selectQueue = (state: StateProp) =>
  state.userInterface.queue;
export const selectQueueStatus = (state: StateProp) =>
  state.userInterface.queueStatus;

export const selectUserInterfaceData = createSelector(
  [
    selectUserInterfaceState,
    selectUserInterfaceActualSection,
    selectUserInterfaceIsNavigating,
    selectUserInterfaceShowSideNav,
    selectUserInterfaceSectionTabSelected,
    selectQueue,
    selectQueueStatus
  ],
  (userState, actualSection, isNavigating, showSideNav, sectionTabSelected, queue, queueStatus) => ({
    userState,
    actualSection,
    isNavigating,
    showSideNav,
    sectionTabSelected,
    queue,
    queueStatus
  }),
);

export default userInterfaceSlice.reducer;
