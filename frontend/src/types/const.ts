export enum Tool {
    Dot = 'Dot',
    Pencil = 'Pencil',
    Eraser = 'Eraser',
    Ellipse = 'Ellipse',
    Rectangle = 'Rectangle',
    Line = 'Line',
    ModeSwitch = 'ModeSwitch'
}

export enum LineType {
    Dot = 'Dot',
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

export type ComplexError = {
    errorType: ErrorType,
    errorText?: string,
}

export enum ErrorType {
    CannotConnect = 'CannotConnect',
    UnknownToken = 'UnknownToken',
    TooManyVariables = 'TooManyVariables',
    NotImplemented = 'NotImplemented',
    InvalidExpression = 'InvalidExpression',
    Unknown = 'Unknown',
}

export enum FunctionStatus {

}

export enum PolarType {
    Cartesian = "cartesian",
    PolarDegrees = "polar-degrees",
    PolarRadians = "polar-radians",
}
