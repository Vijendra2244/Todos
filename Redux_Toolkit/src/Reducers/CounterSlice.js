import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const CountSlice = createSlice({
  name: "Counter",
  initialState,
  reducers: {
    increament: (state, action) => {
      state.count += action.payload;
    },
    decrement: (state, action) => {
      state.count -= action.payload;
    },
  },
});

export const { increament, decrement } = CountSlice.actions;

export default CountSlice.reducer;
