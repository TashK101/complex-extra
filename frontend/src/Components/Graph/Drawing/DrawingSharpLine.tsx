import {Line} from "../../../types/lines.ts";

type DrawingLineProps = {
    line: Line,
    transparent?: boolean,
    getPixelCoords: (p:[number, number]) => [number, number],
}

export const DrawingSharpLine = ({line, transparent, getPixelCoords}: DrawingLineProps) => {
    const pathData = "M " + line.values.map(p => {
        const [x, y] = getPixelCoords(p);
        return`${x} ${y}`
    }).join(" L ");
    return (
        <path
            className={`graph-drawing-line graph-drawing-line-${line.id}`}
            d={pathData}
            fill={'none'}
            stroke={line.color}
            strokeWidth={3}
            opacity={transparent ? 0.3 : 1}
        />);
}
