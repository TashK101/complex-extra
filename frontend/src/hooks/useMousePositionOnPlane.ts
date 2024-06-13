import {RefObject} from "react";
import {ViewRectangle} from "../types/const.ts";
import {useMousePosition} from "./useMousePosition.ts";
import {useBoxRect} from "./useBoxRect.ts";
import {pixelCoordsToAxisCoords} from "../Components/Graph/Drawing/helpers.ts";

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
    if (mouseX && (boxX < mouseX && mouseX < boxX + width) && mouseY && (boxY < mouseY && mouseY < boxY + height)) {
        const pixelX = Math.round(mouseX - boxX);
        const pixelY = Math.round(mouseY - boxY);
        const {x, y} = pixelCoordsToAxisCoords(pixelX, pixelY, {width, height}, viewRect);
        const trim = (x: number, a: number) => parseFloat(x.toFixed(Math.max(0, Math.ceil(-Math.log10(a)))));
        return {
            pixelX,
            pixelY,
            axisX: trim(x, (viewRect.right - viewRect.left) * 0.001),
            axisY: trim(y, (viewRect.top - viewRect.bottom) * 0.001),
            mouseX,
            mouseY,
        }
    }
    return {pixelX: null, pixelY: null, axisX: null, axisY: null, mouseX, mouseY};
}