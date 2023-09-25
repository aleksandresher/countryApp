import { createSlice } from "@reduxjs/toolkit";

const countrySlice = createSlice({
  name: "country",
  initialState: null,
  reducers: {
    setCountryName: (state, action) => action.payload,
  },
});

export const { setCountryName } = countrySlice.actions;

export default countrySlice.reducer;
