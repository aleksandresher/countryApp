import { createSlice } from "@reduxjs/toolkit";

const countryInfoSlice = createSlice({
  name: "countryInfo",
  initialState: null,
  reducers: {
    setCountryInfo: (state, action) => action.payload,
  },
});

export const { setCountryInfo } = countryInfoSlice.actions;

export default countryInfoSlice.reducer;
