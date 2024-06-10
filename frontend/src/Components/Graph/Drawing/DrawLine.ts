import {Line} from "../../../types/lines.ts";
import {LineType} from "../../../types/const.ts";
import {DrawingSharpLine} from "./DrawingSharpLine.tsx";
import {axisCoordsToPixelCoords} from "./helpers.ts";
import {DrawingRectangleLine} from "./DrawingRectangleLine.tsx";
import {DrawingEllipseLine} from "./DrawingEllipseLine.tsx";

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
        case LineType.Segment:
        case LineType.Sharp:
            return DrawingSharpLine({
                line: line,
                transparent: transparent,
                getPixelCoords: getPixelCoords,
            });
        case LineType.Rectangle:
            return DrawingRectangleLine({
                line: line,
                transparent: transparent,
                getPixelCoords: getPixelCoords,
            });
        case LineType.Ellipse:
            return DrawingEllipseLine({
                line: line,
                transparent: transparent,
                getPixelCoords: getPixelCoords,
            });
        default:
            throw new Error();
    }
}