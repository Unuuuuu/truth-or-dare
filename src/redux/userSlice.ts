import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isInitialLoadCompleted: boolean;
  isSignedIn: boolean;
  id?: string;
  nickname?: string;
}

const initialUserState: UserState = {
  isInitialLoadCompleted: false,
  isSignedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    completeInitialLoad: (state) => {
      state.isInitialLoadCompleted = true;
    },
    signIn: (state, action: PayloadAction<{ id: string; nickname: string }>) => ({
      ...state,
      isSignedIn: true,
      id: action.payload.id,
      nickname: action.payload.nickname,
    }),
    signOut: () => ({
      isInitialLoadCompleted: true,
      isSignedIn: false,
    }),
  },
});

export default userSlice;

export const { signIn, signOut, completeInitialLoad } = userSlice.actions;
