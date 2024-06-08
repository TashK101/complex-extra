import {useBoxRect, useMousePosition} from "../../hooks/hooks.ts";
import {useEffect, useRef, useState} from "react";
import {DrawingLine} from "./Drawing/DrawingLine.tsx";
import {zArray, zLabeledStrokes} from "../../App.tsx";

type Props = {
    graphWidth: number,
    graphHeight: number,
    onChangeStrokes: (strokes: zLabeledStrokes) => void,
}

export function DrawingPlane(props: Props): JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {x, y} = useMousePosition(true);
    const {height, width, boxX, boxY} = useBoxRect(boxRef);
    const [cursorX, setCursorX] = useState<number | null>(null);
    const [cursorY, setCursorY] = useState<number | null>(null);
    const [mouseDown, setMouseDown] = useState<boolean>(false)
    const [mouseStrokes, setMouseStrokes]  = useState<zLabeledStrokes>([]);
    const [strokeNumber, setStrokeNumber] = useState<number>(0);
    const [currentStroke, setCurrentStroke] = useState<zArray>([]);

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
    }, [x, y, height, width, boxX, boxY, mouseDown, strokeNumber, props.graphHeight, props.graphWidth]);

    function handleMouseDown() {
        setMouseDown(true);
    }

    function handleMouseUp() {
        setMouseDown(false);
        setMouseStrokes(prev =>
            currentStroke.length > 0 ? [...prev, [strokeNumber, currentStroke]] : prev)
        setStrokeNumber(prev => prev+1);
        setCurrentStroke([]);
        props.onChangeStrokes(mouseStrokes);
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
                {mouseStrokes.concat([strokeNumber, currentStroke]).map( ms => ms[1] && ms[1].length > 0 && (
                    <DrawingLine
                        key={ms[0]}
                        line={ms[1]}
                        height={height}
                        width={width}
                        graphHeight={props.graphHeight}
                        graphWidth={props.graphWidth}
                    />
                ))}
            </svg>
        </div>
    );
}
