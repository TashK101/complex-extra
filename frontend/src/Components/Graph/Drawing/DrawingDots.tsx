import { Line } from "../../../types/lines.ts";

type Props = {
    line: Line,
    transparent?: boolean,
    getPixelCoords: (p: [number, number]) => [number, number],
}

export const DrawingDots = ({ line, transparent, getPixelCoords }: Props) => {
    const [x, y] = getPixelCoords(line.values[0]);
    return (
        <>
            {line.values.map((point, index) => {
                const [x, y] = getPixelCoords(point);
                return (
                    <circle
                        key={`${line.id}-${index}`}
                        cx={x}
                        cy={y}
                        r={3}
                        className={`graph-drawing-line graph-drawing-line-${line.id}`}
                        
                        fill={line.color}
                        opacity={transparent ? 0.3 : 1}
                    />
                );
            })}
        </>
    );
}
