import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Moods } from "../types";

const initialState: Moods = {};

export const moodSlice = createSlice({
  name: "moodSlice",
  initialState: { value: initialState },
  reducers: {
    editMood: (state, action: PayloadAction<Moods>) => {
      state.value = action.payload;
    },
  },
});

const { actions, reducer } = moodSlice;
export const { editMood } = actions;
export default reducer;
