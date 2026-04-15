import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'

const initialState = {
	itemToBuy: null,
	itemType: null,
	status: 'idle',
	error: null,
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const openPurchaseModal = createAsyncThunk(
	'purchase/openPurchaseModal',
	async ({ itemId, type }, { /*getState,*/ rejectWithValue }) => {
		try {
			const apiRoute = type === "champion" ? 'pokemons/data/getchamps' : 'pokemons/data/skins'
			const response = await fetch(`${API_URL}${apiRoute}`)

			if (!response.ok) {
				throw new Error('Failed to fetch items')
			}
			const data = await response.json()
			const items = await Object.values(data);
			const item = await items.find(i => i.id === itemId)

			return { item, type }
		} catch (error) {
			return rejectWithValue(error.message || "Error desconocido")
		}
	}
)

export const confirmPurchase = createAsyncThunk(
  'purchase/confirm',
  async ({ coin, price }, { getState, rejectWithValue }) => {
		const token = localStorage.getItem('token');
    const state = getState();
    const { itemToBuy, itemType } = state.purchase;
    //const price = itemToBuy.price[coin]
    //const { be, rp } = state.user.coins;
	const body = itemType === "champion" ? {
		userID: token,
		championId: itemToBuy.id,
		coin,
		price
	} : {
		userId: token,
		skinId: itemToBuy.id,
		price,
		coin
	}
	const apiRoute = itemType === "champion" ? 'pokemons/users/addpokemon' : 'shop/skin'
    // 1. Obtener datos del ítem usando el selector que definimos antes
    //const item = selectItemFromState(state, selectedItemId, itemType);

    if (!itemToBuy) return rejectWithValue('Ítem no encontrado');

    // 2. Validación de saldo (Ejemplo: prioriza Esencia Azul)
    /*if (blueEssence < item.priceBE && rp < item.priceRP) {
      return rejectWithValue('Saldo insuficiente');
    }*/

    try {
      const response = await fetch(`${API_URL}${apiRoute}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Failed to buy item');

      const data = await response.json();
      return {
        type: itemType,
        /*costBE: itemToBuy.price.be,
        costRP: itemToBuy.price.rp,*/
        newInventoryItem: data 
      };
    } catch (error) {
      return rejectWithValue('Error en la transacción');
    }
  }
);

const purchaseSlice = createSlice({
	name: 'purchase',
	initialState,
	reducers: {
		/*openPurchaseModal: ( state, action ) => {
			let { item, type } = action.payload;
	        state.itemToBuy = item;
			state.itemType = type
		},*/
		closeModal: ( state ) => {
			state.itemToBuy = null;
		}
	},
	extraReducers: (builder) => {
		builder
		/*.addCase(openPurchaseModal.pending, (state) => {
			state.status = 'loading';
		})*/
		.addCase(openPurchaseModal.fulfilled, (state, action) => {
			let { item, type } = action.payload;
			state.status = 'idle';
			state.itemToBuy = item;
			state.itemType = type;
		})
		.addCase(openPurchaseModal.rejected, (state, action) => {
			state.status = 'idle';
			state.error = action.payload
		})
		.addCase(confirmPurchase.pending, (state) => {
			state.status = 'loading';
		})
	}
})

export const { closeModal } = purchaseSlice.actions

export const selectItemToBuy = (state) => state.purchase.itemToBuy
export const selectItemType = (state) => state.purchase.itemType

export const selectPurchaseData = createSelector(
	[ selectItemToBuy, selectItemType],
	( itemToBuy, itemType ) => ({
		itemToBuy,
		itemType
	}))

export default purchaseSlice.reducer