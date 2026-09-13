import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction
} from "@reduxjs/toolkit";
import { RootState } from "../store";

export type ItemType = "skin" | "champion"

export interface Item {
  id: string,
  type: ItemType,
}
export type Coin = "BE" | "RP";

interface PurchaseState {
  isOpen: boolean,
  itemToBuy: Item | null,
  currency: "RP" | "BE" | unknown,
  price: number,
  status: "idle" | "processing" | "success" | "error",
  error: null | string,
  purchaseSuccess: boolean,
  purchasedItemId: null | string,
}

const initialState: PurchaseState = {
  isOpen: false,
  itemToBuy: null,
  currency: null,
  price: 0,
  status: "idle",
  error: null,
  purchaseSuccess: false,
  purchasedItemId: null,
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const confirmPurchase = createAsyncThunk(
  "purchase/confirm",
  async ({ coin, price }: { coin: Coin, price: number }, { getState, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const state = getState() as RootState;
    const { itemToBuy } = state.purchase;

    if (!itemToBuy) return rejectWithValue("Ítem no encontrado");

    const body =
      itemToBuy.type === "champion"
        ? {
            userId: token,
            championId: itemToBuy.id,
            coin,
            price,
          }
        : {
            userId: token,
            skinId: itemToBuy.id,
            price,
            coin,
          };
    const apiRoute =
      itemToBuy.type === "champion" ? "api/v1/store/champion" : "api/v1/store/skin";


    try {
      const response = await fetch(`${API_URL}${apiRoute}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to buy item");

      const data = await response.json();
      return {
        type: itemToBuy.type,
        newInventoryItem: data,
        coin,
        price,
      };
    } catch (error) {
      return rejectWithValue("Error en la transacción");
    }
  },
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    openPurchaseModal: (state, action: PayloadAction<{itemId: string, type: ItemType}>) => {
      const { itemId, type } = action.payload;
      state.itemToBuy = {
        id: itemId,
        type: type
      };
    },
    closeModal: (state) => {
      state.itemToBuy = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmPurchase.pending, (state, action) => {
        const coin = action.meta.arg.coin;
        state.currency = coin;
        state.status = "processing";
      })
      .addCase(confirmPurchase.fulfilled, (state) => {
        state.currency = null;
        state.status = "success";
      });
  },
});

export const { closeModal, openPurchaseModal } = purchaseSlice.actions;

export const selectItemToBuy = (state: { purchase: PurchaseState }) => state.purchase.itemToBuy;
export const selectCurrency = (state: { purchase: PurchaseState }) =>
  state.purchase.currency;
export const selectStatus = (state: { purchase: PurchaseState }) => state.purchase.status;

export const selectPurchaseData = createSelector(
  [selectItemToBuy, selectCurrency, selectStatus],
  (itemToBuy, currency, status) => ({
    itemToBuy,
    currency,
    status,
  }),
);

export default purchaseSlice.reducer;
