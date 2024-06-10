import {createReducer} from '@reduxjs/toolkit';
import {Tool} from "../types/const.ts";
import {
    addLine,
    addResult,
    changeColor,
    changeFunction, changeGhost,
    changeTool,
    eraseAll,
    resizeDrawing,
    resizeResult
} from "./action.ts";
import {Line} from "../types/lines.ts";

type State = {
    tool: Tool,
    color: string,
    function: string,
    drawingView: {top: number, left: number, right: number, bottom: number},
    resultView: {top: number, left: number, right: number, bottom: number},
    lines: Line[],
    result: Line[],
    currentId: number,
    ghost: Line|null,
}

const initialState: State = {
    tool: Tool.Pencil,
    color: '#111166',
    function: 'z',
    drawingView: {top: 10, left: -10, right: 10, bottom: -10},
    resultView: {top: 10, left: -10, right: 10, bottom: -10},
    lines: [],
    result: [],
    currentId: 0,
    ghost: null,
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
            state.drawingView = action.payload;
        })
        .addCase(resizeResult, (state, action) => {
            state.resultView = action.payload;
        })
        .addCase(changeFunction, (state, action) => {
            state.function = action.payload;
        })
        .addCase(eraseAll, (state) => {
            state.lines = [];
            state.result = [];
            state.currentId = 0;
        })
        .addCase(addLine, (state) => {
            if (state.ghost) {
                state.lines.push(state.ghost);
                state.currentId++;
                state.ghost = null;
            }
        })
        .addCase(addResult, (state, action) => {
            state.result = action.payload;
        })
        .addCase(changeGhost, (state, action) => {
            state.ghost = action.payload;
        });
});
