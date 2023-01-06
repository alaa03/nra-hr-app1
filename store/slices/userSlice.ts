import type {PayloadAction} from '@reduxjs/toolkit'
import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type UserState = { username: string, password: string }

const name = "USER"

const initialState: UserState = {
    username: "", password: ""
};

export const userSlice = createSlice({
    name,
    initialState,
    reducers: {
        save_user: (state: any, action: PayloadAction<UserState>) => {
            const {username, password} = action.payload
            state = {username:username, password:password}
            return state
        }
    }
})

export const {save_user} = userSlice.actions
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer