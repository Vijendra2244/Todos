import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  theme: "LIGHTTHEME",
};

export const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    lighTheme: (state) => {
      state.theme = "LIGHTTHEME";
    },
    darkTheme: (state) => {
      state.theme = "DARKTHEME";
    },
  },
});



export const { lighTheme, darkTheme } = ThemeSlice.actions;
export default ThemeSlice.reducer;
