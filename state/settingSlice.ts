import { createSlice } from "@reduxjs/toolkit";

export const settingSlice = createSlice({
  name: "noteSlice",
  initialState: [],
  reducers: {
    editSetting: (state, action) => {
      return action.payload;
    },
  },
});

const { actions, reducer } = settingSlice;
export const { editSetting } = actions;
export default reducer;
