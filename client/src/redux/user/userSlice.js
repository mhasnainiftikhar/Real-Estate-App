import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null, 
  loading: false,
  error: null,
};


const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSucess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload; 
      state.error = null;
    }
    ,
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSucess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
     signOutStart: (state) => {
      state.loading = true;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    signOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSucess,
  signInFailure,
  deleteUserStart,
  deleteUserSucess,
  deleteUserFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
} = userSlice.actions;

export default userSlice.reducer;
