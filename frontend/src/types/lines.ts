//import {LineType} from "./const.ts";

import {LineType} from "./const.ts";

export type zArray = [number, number][]

export type zLabeledStrokes = [number, zArray][]

export type Line = {
    id: number,
    color: string,
    values: zArray,
    type: LineType,
}