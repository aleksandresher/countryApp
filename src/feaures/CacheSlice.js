import { createSlice } from "@reduxjs/toolkit";

const airportDataSlice = createSlice({
  name: "airportData",
  initialState: {
    cachedData: {},
  },
  reducers: {
    setAirportData: (state, action) => {
      const { country, data } = action.payload;
      state.cachedData[country] = data;
    },
  },
});

export const { setAirportData } = airportDataSlice.actions;
export default airportDataSlice.reducer;
