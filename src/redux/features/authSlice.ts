import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  sendAuthUserData: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sendAuthUserData: (state, action) => {
      state.sendAuthUserData = action.payload
    },
  },
})

export const { sendAuthUserData } = authSlice.actions
export default authSlice.reducer
