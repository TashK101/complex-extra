import { v4 as uuidv4 } from 'uuid';
import { createReducer } from '@reduxjs/toolkit';
import { Tool, ViewRectangle } from "../types/const.ts";
import {
    addLine,
    addResult,
    changeColor,
    changeFunction,
    setGhost,
    changeTool,
    eraseAll,
    resizeDrawing,
    resizeResult,
    eraseLine,
    setUserFunctions,
    addUserFunction,
    removeUserFunction,
    updateUserFunction
} from "./action.ts";
import { Line } from "../types/lines.ts";

type State = {
    tool: Tool,
    color: string,
    function: string,
    userFunctions: { id: string, expression: string, color: string }[],
    drawingView: ViewRectangle,
    resultView: ViewRectangle,
    lines: Line[],
    result: Line[],
    currentId: number,
    ghost: Line | null,
};

const initialState: State = {
    tool: Tool.Pencil,
    color: '#111166',
    function: 'z',
    userFunctions: [{ id: uuidv4(), expression: 'z', color: '#111166' }],
    drawingView: { top: 10, left: -10, right: 10, bottom: -10 },
    resultView: { top: 10, left: -10, right: 10, bottom: -10 },
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
            state.result = [];
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
            state.result = state.result.filter(l => !(action.payload.map(p => p.id).includes(l.id)));
            state.result.push(...action.payload);
        })
        .addCase(setGhost, (state, action) => {
            state.ghost = action.payload;
        })
        .addCase(eraseLine, (state, action) => {
            state.lines = state.lines.filter(l => l.id !== action.payload);
            state.result = state.result.filter(l => l.id !== action.payload);
        })
        // множественные функции
        .addCase(setUserFunctions, (state, action) => {
            state.userFunctions = action.payload;
        })
        .addCase(addUserFunction, (state, action) => {
            state.userFunctions.push(action.payload);
        })
        .addCase(removeUserFunction, (state, action) => {
            // action.payload is id now
            state.userFunctions = state.userFunctions.filter(f => f.id !== action.payload);
        })
        .addCase(updateUserFunction, (state, action) => {
            // action.payload = { id, newExpr, color }
            const idx = state.userFunctions.findIndex(f => f.id === action.payload.id);
            if (idx !== -1) {
                state.userFunctions[idx] = {
                    ...state.userFunctions[idx],
                    expression: action.payload.newExpr,
                    color: action.payload.color
                };
            }
        });
});
