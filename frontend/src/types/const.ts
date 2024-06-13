export enum Tool {
    Pencil = 'Pencil',
    Eraser = 'Eraser',
    Ellipse = 'Ellipse',
    Rectangle = 'Rectangle',
    Line = 'Line',
}

export enum LineType {
    Dots = 'Dots',
    Rectangle = 'Rectangle',
    Ellipse = 'Ellipse',
    Curve = 'Curve',
    Sharp = 'Sharp',
    Segment = 'Segment',
}

export type ViewRectangle = {
    top: number,
    bottom: number,
    left: number,
    right: number,
}