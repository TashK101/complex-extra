import {createAction} from '@reduxjs/toolkit';
import {Tool} from "../types/const.ts";
import {Line} from "../types/lines.ts";

export const changeTool = createAction<Tool>('CHANGE_TOOL');

export const changeColor = createAction<string>('CHANGE_COLOR');

export const resizeDrawing = createAction<{
    top: number,
    left: number,
    right: number,
    bottom: number
}>('RESIZE_DRAWING');

export const resizeResult = createAction<{
    top: number,
    left: number,
    right: number,
    bottom: number
}>('RESIZE_RESULT');

export const eraseAll = createAction('ERASE_ALL');

export const eraseLine = createAction<number>("ERASE_LINE");

export const changeFunction = createAction<string>('CHANGE_FUNCTION');

export const addLine = createAction('ADD_LINE');

export const addResult = createAction<Line[]>('ADD_RESULT');

export const setGhost = createAction<Line | null>('CHANGE_GHOST');