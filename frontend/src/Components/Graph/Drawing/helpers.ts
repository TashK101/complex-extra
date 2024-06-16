import {Line, zArray} from "../../../types/lines.ts";
import {LineType, ViewRectangle} from "../../../types/const.ts";

export function pixelCoordsToAxisCoords(
    x: number,
    y: number,
    box: {width: number, height: number},
    viewRect: ViewRectangle,
): { x: number, y: number } {

    // ----t----
    // l   0   r - Смещение точки (0.0) графа относительно нуля прямоугольника = (-l, t)
    // ----b----

    const pixelsInX = box.width / (viewRect.right - viewRect.left);
    const pixelsInY = box.height / (viewRect.top - viewRect.bottom);
    return {
        x: x / pixelsInX + viewRect.left,
        y: -y / pixelsInY + viewRect.top,
    };
}

export function axisCoordsToPixelCoords(
    x: number,
    y: number,
    box: {width: number, height: number},
    viewRect: {top: number, left: number, right: number, bottom: number},
): { x: number, y: number } {

    const pixelsInX = box.width / (viewRect.right - viewRect.left);
    const pixelsInY = box.height / (viewRect.top - viewRect.bottom);
    return {
        x: (x - viewRect.left) * pixelsInX,
        y: (y - viewRect.top) * -pixelsInY
    };
}

export function scatterLine(line: Line, smoothness: number): Line {
    switch (line.type) {
        case LineType.Curve:
        case LineType.Dot:
        case LineType.Sharp:
            return line;
        case LineType.Ellipse:
            return ellipseToPolygon(line, smoothness);
        case LineType.Rectangle:
            return rectangleToPolygon(line, smoothness);
        case LineType.Segment:
            return segmentToSharp(line, smoothness);
    }
}

function segmentToSharp(line: Line, smoothness: number): Line {
    const points: zArray = [];
    const [x1, y1, x2, y2] = [...line.values[0], ...line.values[1]];
    const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    for (let i = 0; i < length; i+= smoothness) {
        points.push([x1 + (i/length) * (x2-x1), y1 + (i/length) * (y2-y1)]);
    }
    return {
        id: line.id,
        color: line.color,
        values: points,
        type: LineType.Sharp,
    }
}

function rectangleToPolygon(line: Line, smoothness: number): Line {
    const points: zArray = [];
    let [x1, y1, x2, y2] = [...line.values[0], ...line.values[1]];
    [x1, x2] = [Math.min(x1, x2), Math.max(x1, x2)];
    [y1, y2] = [Math.min(y1, y2), Math.max(y1, y2)];
    for (let i = x1; i < x2; i+=smoothness) {
        points.push([i, y1]);
    }
    for (let i = y1; i < y2; i+=smoothness) {
        points.push([x2, i]);
    }
    for (let i = x2; i > x1; i-=smoothness) {
        points.push([i, y2]);
    }
    for (let i = y2; i > y1; i-=smoothness) {
        points.push([x1, i]);
    }
    points.push([x1, y1]);
    return {
        id: line.id,
        color: line.color,
        values: points,
        type: LineType.Sharp,
    }
}

function ellipseToPolygon(line: Line, smoothness: number): Line {
    const points: zArray = [];
    const [cx, cy, x1, y1] = [...line.values[0], ...line.values[1]];
    const [rx, ry] = [Math.abs(cx - x1), Math.abs(cy - y1)];

    for (let i = -Math.PI/2; i < Math.PI/2; i+=smoothness) {
        const x = (rx * ry) / Math.sqrt(ry**2 + rx**2 * Math.tan(i)**2);
        const y = x * Math.tan(i);
        points.push([x+cx, y+cy]);
    }
    for (let i = Math.PI *3/2; i > Math.PI/2; i-=smoothness) {
        const x = -(rx * ry) / Math.sqrt(ry**2 + rx**2 * Math.tan(i)**2);
        const y = -x * Math.tan(i);
        points.push([x+cx, y+cy]);
    }

    return {
        id: line.id,
        color: line.color,
        values: points,
        type: LineType.Sharp,
    }
}

export function trimNumber(x: number, a: number): number {
    return parseFloat(x.toFixed(Math.max(0, Math.ceil(-Math.log10(a + Number.EPSILON)))));
}

export function trimNumberString(x: number, a: number): string {
    return x.toFixed(Math.max(0, Math.ceil(-Math.log10(a + Number.EPSILON))));
}

export function getCellSize(size: number): number {
    let cell = size / 20;
    let result = 1;
    if (cell >= 1) {
        while (cell > 10) {
            result *= 10;
            cell /= 10;
        }
    } else {
        while (cell < 1) {
            result /= 10;
            cell *= 10;
        }
    }
    cell = Math.round(cell);
    if (cell >= 5) {
        return result * 5;
    } else if (cell >= 2) {
        return result * 2;
    } else {
        return result;
    }
}
