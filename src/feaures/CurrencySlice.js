import { createSlice } from "@reduxjs/toolkit";

const CurrencySlice = createSlice({
  name: "currency",
  initialState: {
    selectedCurrency: null,
    selectedCurrencySymbol: null,
  },
  reducers: {
    setCurrency: (state, action) => {
      state.selectedCurrency = action.payload.currency;
      state.selectedCurrencySymbol = action.payload.symbol;
    },
  },
});

export const { setCurrency } = CurrencySlice.actions;

export default CurrencySlice.reducer;
