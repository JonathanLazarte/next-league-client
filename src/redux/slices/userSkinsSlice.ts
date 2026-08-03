import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { confirmPurchase } from "@/redux/slices/purchaseSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserSkins = createAsyncThunk(
  "userSkins/getUserSkins",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}api/v1/user/skin-collection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: id }),
      });

      if (!response.ok) {
        console.log("SE ESTA EJECUTANDO EL ERROR");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userSkins = await response.json();

      return { userSkins }; // Return the data to be used in the reducer
    } catch (error) {
      return rejectWithValue(error.message); // Handle errors
    }
  },
);

const initialState = {
  loading: false,
  skins: [],
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
        const { userSkins } = action.payload;
        state.skins = userSkins; // Update state with fetched Items
      })
      .addCase(getUserSkins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Set error message
      })
      .addCase(confirmPurchase.fulfilled, (state, action) => {
        const { newInventoryItem, type } = action.payload;
        if (type === "skin") {
          const updatedSkins = [...state.skins];
          updatedSkins.push(newInventoryItem);
          state.skins = updatedSkins;
        }
      });
  },
});

export const selectUserSkinsState = (state) => state.userSkins;
export const selectUserSkins = (state) => state.userSkins.skins;
export const selectUserSkinsLoading = (state) => state.userSkins.loading;
export const selectUserSkinsError = (state) => state.userSkins.error;

export const selectUserSkinsData = createSelector(
  [selectUserSkins, selectUserSkinsLoading, selectUserSkinsError],
  (userSkins, loading, error) => ({
    userSkins,
    loading,
    error,
  }),
);

export default userSkinsSlice.reducer;
