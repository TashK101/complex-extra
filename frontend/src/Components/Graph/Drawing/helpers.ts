export function pixelCoordsToAxisCoords(
    x: number,
    y: number,
    box: {width: number, height: number},
    viewRect: {top: number, left: number, right: number, bottom: number},
): { x: number, y: number } {

    // ----t----
    // l   0   r - Смещение точки (0.0) графа относительно нуля прямоугольника = (-l, t)
    // ----b----

    const pixelsInX = box.width / (viewRect.right - viewRect.left);
    const pixelsInY = box.height / (viewRect.top - viewRect.bottom);
    console.log({x: x / pixelsInX + viewRect.left, y: -y / pixelsInY + viewRect.top});
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