import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoading: boolean;
  isSignedIn: boolean;
  id?: string;
  nickname?: string;
}

const initialUserState: UserState = {
  isLoading: true,
  isSignedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    load: (state) => {
      state.isLoading = false;
    },
    signIn: (state, action: PayloadAction<{ id: string; nickname: string }>) => ({
      ...state,
      isSignedIn: true,
      id: action.payload.id,
      nickname: action.payload.nickname,
    }),
  },
});

export default userSlice;

export const { signIn, load } = userSlice.actions;
