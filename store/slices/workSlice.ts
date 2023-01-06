import {createSlice} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type WorkState = { startTime: number | null, shifts: { start: number, end: number } [] }

const name = "WORK"

const initialState: WorkState = {
    startTime: null,
    shifts: []
};

export const workSlice = createSlice({
    name,
    initialState,
    reducers: {
        setStartWork: (state: any) => {
            state = {...state, startTime: new Date().getTime(),shifts:state.shifts||[]}
            return state
        },
        resetWork: (state: any) => {
            state = {startTime: null, shifts: [...(state.shifts||[]), {start: state.startTime, end: new Date().getTime()}]}
            return state
        }
    }
})

export const {setStartWork, resetWork} = workSlice.actions
export const selectWorkStart = (state: RootState) => state.work.startTime ? new Date(state.work.startTime) : null;

export const selectShifts = (state: RootState) => state.work.shifts;
export default workSlice.reducer