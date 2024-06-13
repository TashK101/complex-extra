import {RefObject} from "react";
import {Tool, ViewRectangle} from "../types/const.ts";
import {useMousePosition} from "./useMousePosition.ts";
import {useBoxRect} from "./useBoxRect.ts";
import {getCellSize, pixelCoordsToAxisCoords, trimNumber} from "../Components/Graph/Drawing/helpers.ts";
import {useAppSelector} from "./index.ts";

export function useMousePositionOnPlane(viewRect: ViewRectangle, boxRef: RefObject<HTMLElement>): {
    pixelX: number | null,
    pixelY: number | null,
    axisX: number | null,
    axisY: number | null,
    mouseX: number | null,
    mouseY: number | null,
} {
    const {mouseX, mouseY} = useMousePosition(true);
    const {width, height, boxX, boxY} = useBoxRect(boxRef);
    const smoothness = useAppSelector(state => state.tool) === Tool.Pencil ? 0.01 : 0.1;
    if (mouseX && (boxX < mouseX && mouseX < boxX + width) && mouseY && (boxY < mouseY && mouseY < boxY + height)) {
        const pixelX = Math.round(mouseX - boxX);
        const pixelY = Math.round(mouseY - boxY);
        const {x, y} = pixelCoordsToAxisCoords(pixelX, pixelY, {width, height}, viewRect);
        return {
            pixelX,
            pixelY,
            axisX: trimNumber(x, getCellSize(viewRect.right - viewRect.left) * smoothness),
            axisY: trimNumber(y, getCellSize(viewRect.top - viewRect.bottom) * smoothness),
            mouseX,
            mouseY,
        }
    }
    return {pixelX: null, pixelY: null, axisX: null, axisY: null, mouseX, mouseY};
}