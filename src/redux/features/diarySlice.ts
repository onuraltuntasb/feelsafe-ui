import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  sendSelectedDiaryData: {
    id: -1,
    userId: -1,
    header: "",
    content: "",
    createdAt: "",
    updatedAt: "",
  },
  getUsersAllDiaryData: {},
}

export const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    sendSelectedDiaryData: (state, action) => {
      state.sendSelectedDiaryData = action.payload
    },
    getUsersAllDiaryData: (state, action) => {
      state.getUsersAllDiaryData = action.payload
    },
  },
})

export const { sendSelectedDiaryData, getUsersAllDiaryData } =
  diarySlice.actions
export default diarySlice.reducer
