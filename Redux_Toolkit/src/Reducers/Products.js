import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

export const FetchSlice = createSlice({
  name: "fetch",
  initialState, // Corrected typo
  reducers: {
    fetchSuccess(state, action) {
      state.data = action.payload; // Corrected payload usage
    },
  },
});

export const { fetchSuccess } = FetchSlice.actions;
export default FetchSlice.reducer;

export const fetchData = () => async (dispatch) => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();
    dispatch(fetchSuccess(data)); // Corrected action type
  } catch (error) {
    console.log("Error fetching product data:", error);
  }
};
