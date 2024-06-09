import {useBoxRect, useMousePosition} from "../../hooks/hooks.ts";
import {useEffect, useRef, useState} from "react";
import {DrawingLine} from "./Drawing/DrawingLine.tsx";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {addLine} from "../../store/action.ts";
import {LineType} from "../../types/const.ts";
import {zArray} from "../../types/lines.ts";

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
    const [mouseDown, setMouseDown] = useState<boolean>(false)
    const [currentStroke, setCurrentStroke] = useState<zArray>([]);

    const currentId = useAppSelector(state => state.currentId)
    const currentColor = useAppSelector(state => state.color);
    const lines = useAppSelector(state => state.lines);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (x && (boxX < x && x < boxX + width) && y && (boxY < y && y < boxY + height)) {
            const currentX = Math.round(x - boxX);
            const currentY = Math.round(y - boxY);
            setCursorX(currentX);
            setCursorY(currentY);
            if (mouseDown) {
                setCurrentStroke(prev => [
                    ...prev, [
                        (currentX / (width / props.graphWidth)) - (props.graphWidth/2),
                        -((currentY / (height / props.graphHeight)) - (props.graphHeight/2))]]);
            }
        } else {
            setCursorY(null);
            setCursorX(null);
        }
    }, [x, y, height, width, boxX, boxY, mouseDown, props.graphHeight, props.graphWidth]);

    function handleMouseDown() {
        setMouseDown(true);
    }

    function handleMouseUp() {
        setMouseDown(false);
        if (currentStroke.length > 0)
        {
            dispatch(addLine({
                id: currentId,
                color: currentColor,
                type: LineType.Sharp,
                values: currentStroke,
            }));
        }
        setCurrentStroke([]);
    }

    return (
        <div
            className={'graph-draw graph-window'}
            ref={boxRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
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
            </svg>
        </div>
    );
}
