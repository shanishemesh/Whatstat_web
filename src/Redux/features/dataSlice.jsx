import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
    name: 'textData',
    initialState: {
        isStatRun: false,
        freshData: {}
    },
    reducers: {
        
        saveDataFromDB: (state, action) => {
            state.freshData = action.payload;
        },
        deleteTextFile: (state) => {
            state.textFileData = '';
        },
        changeStatRun: (state) => {
            state.isStatRun = !state.isStatRun;
        }
    }
});

export const { saveDataFromDB, deleteTextFile, changeStatRun } = dataSlice.actions;

export default dataSlice.reducer;