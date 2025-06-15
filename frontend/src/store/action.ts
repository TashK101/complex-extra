import {createAction} from '@reduxjs/toolkit';
import {Tool, ViewRectangle} from "../types/const.ts";
import {Line} from "../types/lines.ts";

export const changeTool = createAction<Tool>('CHANGE_TOOL');

export const changeColor = createAction<string>('CHANGE_COLOR');

export const resizeDrawing = createAction<ViewRectangle>('RESIZE_DRAWING');

export const resizeResult = createAction<ViewRectangle>('RESIZE_RESULT');

export const eraseAll = createAction('ERASE_ALL');

export const eraseLine = createAction<number>("ERASE_LINE");

export const changeFunction = createAction<string>('CHANGE_FUNCTION');

export const addLine = createAction('ADD_LINE');

export const addResult = createAction<Line[]>('ADD_RESULT');

export const setGhost = createAction<Line | null>('CHANGE_GHOST');

export const setUserFunctions = createAction<{ id: string, expression: string, color: string }[]>('setUserFunctions');

export const addUserFunction = createAction<{ id: string, expression: string, color: string }>('addUserFunction');

export const removeUserFunction = createAction<string>('removeUserFunction');  // payload is id

export const updateUserFunction = createAction<{ id: string, newExpr: string, color: string }>('updateUserFunction');

export const changeLnBranches = createAction<number>('settings/changeLnBranches');

export const changeConnectTransformedDots = createAction<boolean>('settings/changeConnectTransformedDots');
