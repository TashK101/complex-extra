import {Line} from "../../../types/lines.ts";

type DrawingLineProps = {
    line: Line,
    transparent?: boolean,
    getPixelCoords: (p:[number, number]) => [number, number],
}

export const DrawingRectangleLine = ({line, transparent, getPixelCoords}: DrawingLineProps) => {
    const [x1, y1] = getPixelCoords(line.values[0]);
    const [x2, y2] = getPixelCoords(line.values[1]);
    return (
        <rect
            className={`graph-drawing-line graph-drawing-line-${line.id}`}
            x={Math.min(x1, x2)}
            y={Math.min(y1, y2)}
            width={Math.abs(x2-x1)}
            height={Math.abs(y2-y1)}
            fill={'transparent'}
            stroke={line.color}
            strokeWidth={3}
            opacity={transparent ? 0.3 : 1}
        />);
}
