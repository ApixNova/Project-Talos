import { createSlice } from "@reduxjs/toolkit";

export const noteSlice = createSlice({
  name: "noteSlice",
  initialState: [],
  reducers: {
    editNote: (state, action) => {
      return action.payload;
    },
  },
});

const { actions, reducer } = noteSlice;
export const { editNote } = actions;
export default reducer;
