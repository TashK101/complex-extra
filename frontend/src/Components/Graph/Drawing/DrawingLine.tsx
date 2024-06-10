type DrawingLineProps = {
    line: [number, number][],
    color: string,
    transparent?: boolean,
    getPixelCoords: (p:[number, number]) => [number, number],
}

export const DrawingLine = ({line, color, transparent, getPixelCoords}: DrawingLineProps) => {
    const pathData = "M " + line.map(p => {
        const [x, y] = getPixelCoords(p);
        return`${x} ${y}`
    }).join(" L ");
    return (
        <path
            className="path"
            d={pathData}
            fill={'transparent'}
            stroke={color}
            strokeWidth={3}
            opacity={transparent ? 0.3 : 1}
        />);
}
