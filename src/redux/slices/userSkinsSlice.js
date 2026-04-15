import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { confirmPurchase } from "@/redux/slices/purchaseSlice.js";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserSkins = createAsyncThunk(
  "userSkins/getUserSkins",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}pokemons/users/skins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: id }),
      });
      const response2 = await fetch(`${API_URL}pokemons/data/skins`);

      if (!response.ok) {
        console.log("SE ESTA EJECUTANDO EL ERRORR");
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userSkins = await response.json();
      const skinsData = await response2.json();

      const fulFillSkinsWithData = () => {
        const data = skinsData;

        if (typeof data !== "string" && Array.isArray(data)) {
          const userSkinsData = userSkins
            .map((us) => {
              const respectiveSkinData = data.find(
                (skinData) => skinData.id === us.id,
              );
              return respectiveSkinData
                ? { ...respectiveSkinData, purchaseDate: us.purchaseDate }
                : null;
            })
            .filter(Boolean)
            .reverse();
          return userSkinsData;
        }
      };

      const userSkinsFull = fulFillSkinsWithData();

      return { userSkins, userSkinsFull }; // Return the data to be used in the reducer
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  },
);

const initialState = {
  loading: false,
  skins: [],
  skinsFull: [],
  error: "",
};

const userSkinsSlice = createSlice({
  name: "userSkins",
  initialState,
  reducers: {
    buySkin: (/*state, action*/) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserSkins.pending, (state) => {
        state.loading = true;
        state.error = ""; // Clear any previous errors
      })
      .addCase(getUserSkins.fulfilled, (state, action) => {
        state.loading = false;
        const { userSkins, userSkinsFull } = action.payload;
        state.skins = userSkins; // Update state with fetched Items
        state.skinsFull = userSkinsFull;
      })
      .addCase(getUserSkins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Set error message
      })
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const updatedSkins = [...state.skins];
        updatedSkins.push(action.payload.newInventoryItem);
        state.skins = updatedSkins;
      });
  },
});

export const selectUserSkinsState = (state) => state.userSkins;
export const selectUserSkins = (state) => state.userSkins.skins;
export const selectUserSkinsFull = (state) => state.userSkins.skinsFull;
export const selectUserSkinsLoading = (state) => state.userSkins.loading;
export const selectUserSkinsError = (state) => state.userSkins.error;

export const selectUserSkinsData = createSelector(
  [
    selectUserSkins,
    selectUserSkinsFull,
    selectUserSkinsLoading,
    selectUserSkinsError,
  ],
  (userSkins, userSkinsFull, loading, error) => ({
    userSkins,
    userSkinsFull,
    loading,
    error,
  }),
);

export default userSkinsSlice.reducer;
