import {createReducer} from '@reduxjs/toolkit';
import {Tool} from "../types/const.ts";
import {
    addLine,
    addResult,
    changeColor,
    changeFunction,
    changeTool,
    eraseAll,
    resizeDrawing,
    resizeResult
} from "./action.ts";
import {Line} from "../types/lines.ts";

const initialState = {
    tool: Tool.Pencil,
    color: '#111166',
    function: 'z',
    sizeDrawing: 20,
    sizeResult: 20,
    lines: new Array<Line>(),
    result: new Array<Line>(),
    currentId: 0,
};

export const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeTool, (state, action) => {
            state.tool = action.payload;
        })
        .addCase(changeColor, (state, action) => {
            state.color = action.payload;
        })
        .addCase(resizeDrawing, (state, action) => {
            state.sizeDrawing = action.payload;
        })
        .addCase(resizeResult, (state, action) => {
            state.sizeResult = action.payload;
        })
        .addCase(changeFunction, (state, action) => {
            state.function = action.payload;
        })
        .addCase(eraseAll, (state) => {
            state.lines = [];
            state.result = [];
            state.currentId = 0;
        })
        .addCase(addLine, (state, action) => {
            state.lines.push(action.payload);
            state.currentId++;
        })
        .addCase(addResult, (state, action) => {
            state.result = action.payload;
        });
});
