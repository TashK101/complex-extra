import {useBoxRect} from "../../hooks/useBoxRect.ts";
import {useEffect, useRef, useState} from "react";
import {DrawingLine} from "./Drawing/DrawingLine.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {addLine, changeGhost} from "../../store/action.ts";
import {LineType} from "../../types/const.ts";
import {useMousePosition} from "../../hooks/useMousePosition.ts";
import {Line} from "../../types/lines.ts";

type Props = {
    graphWidth: number,
    graphHeight: number,
}

export function DrawingPlane(props: Props): JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {x, y} = useMousePosition(true);
    const {height, width, boxX, boxY} = useBoxRect(boxRef);
    const [cursorX, setCursorX] = useState<number | null>(null);
    const [cursorY, setCursorY] = useState<number | null>(null);
    const isDrawing = useRef(false);

    const currentId = useAppSelector(state => state.currentId)
    const currentColor = useAppSelector(state => state.color);
    const lines = useAppSelector(state => state.lines);
    const currentLine = useAppSelector(state => state.ghost);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (x && (boxX < x && x < boxX + width) && y && (boxY < y && y < boxY + height)) {
            const currentX = Math.round(x - boxX);
            const currentY = Math.round(y - boxY);
            setCursorX(currentX);
            setCursorY(currentY);

            // const drawing = boxRef.current && (!boxRef.current.matches(':hover') || boxRef.current.matches(':active'));
            if (isDrawing.current) {
                const point: [number, number] = [
                    (currentX / (width / props.graphWidth)) - (props.graphWidth / 2),
                    -((currentY / (height / props.graphHeight)) - (props.graphHeight / 2))
                ];
                const line: Line = (currentLine
                    ? {
                        id: currentLine.id,
                        color: currentLine.color,
                        type: currentLine.type,
                        values: [...currentLine.values, point],
                    }
                    : {
                        id: currentId,
                        color: currentColor,
                        type: LineType.Sharp,
                        values: [point],
                    });
                dispatch(changeGhost(line));
            } else {
                dispatch(changeGhost(null));
            }
        } else {
            setCursorY(null);
            setCursorX(null);
        }
    }, [x, y, height, width, boxX, boxY, isDrawing, props.graphHeight, props.graphWidth]);

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
            onTouchCancel={() => {dispatch(changeGhost(null)); handleTouchEnd()}}
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
                {lines.map( line => (
                    <DrawingLine
                        key={line.id}
                        line={line.values}
                        height={height}
                        width={width}
                        graphHeight={props.graphHeight}
                        graphWidth={props.graphWidth}
                        color={line.color}
                    />
                ))}
                {currentLine && (<DrawingLine
                    line={currentLine.values}
                    height={height}
                    width={width}
                    graphHeight={props.graphHeight}
                    graphWidth={props.graphWidth}
                    color={currentLine.color}
                    transparent
                />)}
            </svg>
        </div>
    );
}
