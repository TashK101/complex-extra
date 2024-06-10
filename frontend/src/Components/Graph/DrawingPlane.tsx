import {useBoxRect} from "../../hooks/useBoxRect.ts";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {addLine, eraseLine, setGhost} from "../../store/action.ts";
import {LineType, Tool} from "../../types/const.ts";
import {useMousePosition} from "../../hooks/useMousePosition.ts";
import {DrawLine} from "./Drawing/DrawLine.ts";
import {pixelCoordsToAxisCoords} from "./Drawing/helpers.ts";

type Props = {
    graphWidth: number,
    graphHeight: number,
}

const lineRegex = 'graph-drawing-line-(\\d+)';

export function DrawingPlane(props: Props): JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {mouseX, mouseY} = useMousePosition(true);
    const {height, width, boxX, boxY} = useBoxRect(boxRef);
    const [cursorX, setCursorX] = useState<number | null>(null);
    const [cursorY, setCursorY] = useState<number | null>(null);
    const isDrawing = useRef(false);

    const currentId = useAppSelector(state => state.currentId)
    const currentColor = useAppSelector(state => state.color);
    const tool = useAppSelector(state => state.tool);
    const lines = useAppSelector(state => state.lines);
    const currentLine = useAppSelector(state => state.ghost);
    const viewRect = useAppSelector(state => state.drawingView);
    const dispatch = useAppDispatch();

    function handleDraw(x: number, y: number) {
        switch (tool) {
            case Tool.Eraser:
                const element = document.elementFromPoint(mouseX ?? 0, mouseY ?? 0);
                const match = element && element instanceof SVGElement
                    ? element.classList.toString().match(lineRegex) : null;
                match && dispatch(eraseLine(parseInt(match[1])));
                break;
            case Tool.Rectangle:
                dispatch(setGhost(currentLine
                    ? {
                        id: currentLine.id,
                        color: currentLine.color,
                        type: LineType.Rectangle,
                        values: [currentLine.values[0], [x, y]],
                    }
                    : {
                        id: currentId,
                        color: currentColor,
                        type: LineType.Rectangle,
                        values: [[x, y], [x, y]],
                    }));
                break;
            case Tool.Ellipse:
                dispatch(setGhost(currentLine
                    ? {
                        id: currentLine.id,
                        color: currentLine.color,
                        type: LineType.Ellipse,
                        values: [currentLine.values[0], [x, y]],
                    }
                    : {
                        id: currentId,
                        color: currentColor,
                        type: LineType.Ellipse,
                        values: [[x, y], [x, y]],
                    }));
                break;
            case Tool.Line:
                dispatch(setGhost(currentLine
                    ? {
                        id: currentLine.id,
                        color: currentLine.color,
                        type: LineType.Segment,
                        values: [currentLine.values[0], [x, y]],
                    }
                    : {
                        id: currentId,
                        color: currentColor,
                        type: LineType.Segment,
                        values: [[x, y], [x, y]],
                    }));
                break;
            default:
                dispatch(setGhost(currentLine
                    ? {
                        id: currentLine.id,
                        color: currentLine.color,
                        type: LineType.Sharp,
                        values: [...currentLine.values, [x, y]],
                    }
                    : {
                        id: currentId,
                        color: currentColor,
                        type: LineType.Sharp,
                        values: [[x, y]],
                    }));
                break;
        }
    }

    useEffect(() => {
        if (mouseX && (boxX < mouseX && mouseX < boxX + width) && mouseY && (boxY < mouseY && mouseY < boxY + height)) {
            const currentX = Math.round(mouseX - boxX);
            const currentY = Math.round(mouseY - boxY);
            setCursorX(currentX);
            setCursorY(currentY);

            if (isDrawing.current) {
                const {x, y} = pixelCoordsToAxisCoords(currentX, currentY, {height, width}, viewRect);
                handleDraw(x, y);
            } else {
                currentLine || dispatch(setGhost(null));
            }
        } else {
            setCursorY(null);
            setCursorX(null);
        }
    }, [mouseX, mouseY, height, width, boxX, boxY, isDrawing, props.graphHeight, props.graphWidth]);

    function handleMouseDown() {
        isDrawing.current = true;
    }

    function handleMouseUp() {
        isDrawing.current = false;
        dispatch(addLine());
    }

    function handleTouchEnd() {
        isDrawing.current = false;
        dispatch(addLine());
    }

    return (
        <div
            className={'graph-draw graph-window'}
            ref={boxRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => {
                dispatch(setGhost(null));
                handleTouchEnd()
            }}
        >
            <div className={'graph-cursor-x'} style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: cursorX ?? 0,
                width: cursorX ? 1 : 0,
                backgroundColor: 'var(--accent-color)',
            }}/>
            <div className={'graph-cursor-y'} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: cursorY ?? 0,
                height: cursorY ? 1 : 0,
                backgroundColor: 'var(--accent-color)',
            }}/>
            <svg style={{height: '100%', width: '100%'}}>
                {lines.map(line => (
                    <DrawLine
                        key={line.id}
                        line={line}
                        viewRect={viewRect}
                        box={{width, height}}
                    />
                ))}
                {currentLine && (<DrawLine
                    line={currentLine}
                    viewRect={viewRect}
                    box={{width, height}}
                    transparent
                />)}
            </svg>
        </div>
    );
}
