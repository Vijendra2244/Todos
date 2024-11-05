import { configureStore } from "@reduxjs/toolkit";
import { CountSlice } from "../Reducers/CounterSlice";
import { ThemeSlice } from "../Reducers/ThemeSlice";
import { FetchSlice } from "../Reducers/Products";
export const store = configureStore({
  reducer: {
    counter: CountSlice.reducer,
    theme: ThemeSlice.reducer,
    fetch: FetchSlice.reducer,
  },
});
