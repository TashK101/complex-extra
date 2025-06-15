import {Line} from "../../../types/lines.ts";
import {LineType, ViewRectangle} from "../../../types/const.ts";
import {DrawingSharpLine} from "./DrawingSharpLine.tsx";
import {axisCoordsToPixelCoords} from "./helpers.ts";
import {DrawingRectangleLine} from "./DrawingRectangleLine.tsx";
import {DrawingEllipseLine} from "./DrawingEllipseLine.tsx";
import {DrawingDots} from "./DrawingDots.tsx";

type Props = {
    line: Line,
    box: {width: number, height: number},
    viewRect: ViewRectangle,
    transparent?: boolean,
    forceDots?: boolean
}

export function DrawLine({ line, box, viewRect, transparent, forceDots }: Props): React.JSX.Element {

    function getPixelCoords(point: [number, number]): [number, number] {
        const { x, y } = axisCoordsToPixelCoords(point[0], point[1], box, viewRect);
        return [x, y];
    }

    if (forceDots || line.type === LineType.Dot) {
        return DrawingDots({
            line,
            transparent,
            getPixelCoords
        });
    }

    switch (line.type) {
        case LineType.Segment:
        case LineType.Sharp:
            return DrawingSharpLine({
                line,
                transparent,
                getPixelCoords
            });
        case LineType.Rectangle:
            return DrawingRectangleLine({
                line,
                transparent,
                getPixelCoords
            });
        case LineType.Ellipse:
            return DrawingEllipseLine({
                line,
                transparent,
                getPixelCoords
            });
        default:
            throw new Error();
    }
}
