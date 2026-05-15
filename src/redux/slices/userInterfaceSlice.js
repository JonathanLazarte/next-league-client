import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = {
  userState: "Online",
  actualSection: "Home",
  isNavigaiting: false,
  isPlayButtonSelected: false,
};

const userInterfaceSlice = createSlice({
  name: "userInterface",
  initialState,
  reducers: {
    setIsPlayButtonSelected: (state, action) => {
      const isPlayButtonSelected = action.payload;
      console.log(isPlayButtonSelected);
    },
    setActualSection: (state, action) => {
      state.actualSection = action.payload;
    },
    setUserState: (state, action) => {
      state.userState = action.payload;
    },
    setIsNavigating: (state, action) => {
      state.isNavigaiting = action.payload;
    },
  },
});

export const {
  setIsPlayButtonSelected,
  setActualSection,
  setUserState,
  setIsNavigating,
} = userInterfaceSlice.actions;

export const selectUserInterfaceIsPlayButtonSelected = (state) =>
  state.userInterface.isPlayButtonSelected;
export const selectUserInterfaceActualSection = (state) =>
  state.userInterface.actualSection;
export const selectUserInterfaceState = (state) =>
  state.userInterface.userState;
export const selectUserInterfaceIsNavigating = (state) =>
  state.userInterface.isNavigaiting;

export const selectUserInterfaceData = createSelector(
  [
    selectUserInterfaceState,
    selectUserInterfaceActualSection,
    selectUserInterfaceIsPlayButtonSelected,
    selectUserInterfaceIsNavigating,
  ],
  (userState, actualSection, isPlayButtonSelected, isNavigating) => ({
    userState,
    actualSection,
    isPlayButtonSelected,
    isNavigating,
  }),
);

export default userInterfaceSlice.reducer;
