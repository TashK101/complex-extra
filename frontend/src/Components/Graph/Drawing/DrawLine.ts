import {Line} from "../../../types/lines.ts";
import {LineType} from "../../../types/const.ts";
import {DrawingLine} from "./DrawingLine.tsx";
import {axisCoordsToPixelCoords} from "./helpers.ts";

type Props = {
    line: Line,
    box: {width: number, height: number},
    viewRect: {top: number, left: number, bottom: number, right: number},
    transparent?: boolean
}

export function DrawLine({line, box, viewRect, transparent}: Props): React.JSX.Element {

    function getPixelCoords(point: [number, number]): [number, number] {
        const {x, y} = axisCoordsToPixelCoords(point[0], point[1], box, viewRect);
        return [x, y];
    }

    switch (line.type) {
        case LineType.Sharp:
            return DrawingLine({
                line: line.values,
                color: line.color,
                transparent: transparent,
                getPixelCoords: getPixelCoords,
            });
        case LineType.Dots:
        case LineType.Curve:
        case LineType.Ellipse:
        case LineType.Rectangle:
            throw new Error();
        default:
            throw new Error();
    }
}