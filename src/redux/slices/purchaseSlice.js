import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
  itemToBuy: null, // el item completo
  currency: null, // "RP" | "BE" | "OE" | etc.
  price: 0, // precio final (con descuento si aplica)

  status: "idle", // "idle" | "processing" | "success" | "error"
  selectedCurrency: null,
  error: null,

  purchaseSuccess: false,
  purchasedItemId: null,
};
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const confirmPurchase = createAsyncThunk(
  "purchase/confirm",
  async ({ coin, price }, { getState, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const state = getState();
    const { itemToBuy, itemType } = state.purchase;
    //const price = itemToBuy.price[coin]
    //const { be, rp } = state.user.coins;
    const body =
      itemType === "champion"
        ? {
            userID: token,
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
      itemType === "champion" ? "pokemons/users/addpokemon" : "shop/skin";
    //const item = selectItemFromState(state, selectedItemId, itemType);

    if (!itemToBuy) return rejectWithValue("Ítem no encontrado");

    // 2. Validación de saldo (Ejemplo: prioriza Esencia Azul)
    /*if (blueEssence < item.priceBE && rp < item.priceRP) {
      return rejectWithValue('Saldo insuficiente');
    }*/

    try {
      const response = await fetch(`${API_URL}${apiRoute}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to buy item");

      const data = await response.json();
      return {
        /*costBE: itemToBuy.price.be,
        costRP: itemToBuy.price.rp,*/
        newInventoryItem: data,
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
    openPurchaseModal: (state, action) => {
      let { itemId, type } = action.payload;
      state.itemToBuy = { id: itemId, type };
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
        state.selectedCurrency = coin;
        state.status = "processing";
      })
      .addCase(confirmPurchase.fulfilled, (state) => {
        state.selectedCurrency = null;
        state.status = "success";
      });
  },
});

export const { closeModal, openPurchaseModal } = purchaseSlice.actions;

export const selectItemToBuy = (state) => state.purchase.itemToBuy;
export const selectselectedCurrency = (state) =>
  state.purchase.selectedCurrency;
export const selectStatus = (state) => state.purchase.status;

export const selectPurchaseData = createSelector(
  [selectItemToBuy, selectselectedCurrency, selectStatus],
  (itemToBuy, selectedCurrency, status) => ({
    itemToBuy,
    selectedCurrency,
    status,
  }),
);

export default purchaseSlice.reducer;
