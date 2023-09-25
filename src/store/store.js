import { configureStore } from "@reduxjs/toolkit";
import countrySliceReducer from "../feaures/CountrySlice";
import currencySliceReducer from "../feaures/CurrencySlice";
import airportDataReducer from "../feaures/CacheSlice";
import countryInfoReducer from "../feaures/CountryInfoSlice";

const store = configureStore({
  reducer: {
    country: countrySliceReducer,
    currency: currencySliceReducer,
    airportData: airportDataReducer,
    countryInfo: countryInfoReducer,
  },
});

export default store;
