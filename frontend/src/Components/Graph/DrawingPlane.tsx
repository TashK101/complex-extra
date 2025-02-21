import {useBoxRect} from "../../hooks/useBoxRect.ts";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {addLine, eraseLine, setGhost} from "../../store/action.ts";
import {LineType, Tool} from "../../types/const.ts";
import {DrawLine} from "./Drawing/DrawLine.ts";
import {useMousePositionOnPlane} from "../../hooks/useMousePositionOnPlane.ts";
import {Line} from "../../types/lines.ts";

const lineRegex = 'graph-drawing-line-(\\d+)';

interface DrawingPlaneProps {
    usePolar: boolean;
}

export function DrawingPlane({usePolar}: DrawingPlaneProps): JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {height, width} = useBoxRect(boxRef);
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

    const {pixelX, pixelY, axisX, axisY, mouseX, mouseY} = useMousePositionOnPlane(viewRect, boxRef);
    const svgLines = useMemo(() => {
        
        return lines.map(line => (
            <DrawLine
                key={line.id}
                line={line}
                viewRect={viewRect}
                box={{width, height}}
            />
        ))
    }, [lines, viewRect, width, height]);

    function handleDraw(x: number, y: number) {
        const tempLine: Line = currentLine
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
            };
        switch (tool) {
            case Tool.Eraser:
                const element = document.elementFromPoint(mouseX ?? 0, mouseY ?? 0);
                const match = element && element instanceof SVGElement
                    ? element.classList.toString().match(lineRegex) : null;
                match && dispatch(eraseLine(parseInt(match[1])));
                return;
            case Tool.Rectangle:
                tempLine.type = LineType.Rectangle;
                tempLine.values = currentLine ? [currentLine.values[0], [x, y]] : [[x, y], [x, y]];
                break;
            case Tool.Ellipse:
                tempLine.type = LineType.Ellipse;
                tempLine.values = currentLine ? [currentLine.values[0], [x, y]] : [[x, y], [x, y]];
                break;
            case Tool.Line:
                tempLine.type = LineType.Segment;
                tempLine.values = currentLine ? [currentLine.values[0], [x, y]] : [[x, y], [x, y]];
                break;
            case Tool.Dot:
                tempLine.type = LineType.Dot;
                tempLine.values = [[x, y]];
                break;
        }
        dispatch(setGhost(tempLine));
    }


    useEffect(() => {
        if (pixelX && pixelY) {
            setCursorX(pixelX);
            setCursorY(pixelY);
        } else {
            setCursorY(null);
            setCursorX(null);
        }
    }, [pixelX, pixelY]);

    useEffect(() => {
        if (axisX !== null && axisY !== null && isDrawing.current) {
            handleDraw(axisX, axisY);
        } else {
            currentLine && dispatch(setGhost(null));
        }
    }, [axisX, axisY, isDrawing.current]);

    function handleMouseDown() {
        axisX !== null && axisY !== null && handleDraw(axisX, axisY);
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

    const polarGrid = useMemo(() => {
        if (!usePolar || !width || !height) return null;
        const centerX = width / 2;
        const centerY = height / 2;
        const numCircles = 5; // Number of concentric circles
        const numRadialLines = 12; // Number of radial lines
        const maxRadius = Math.min(width, height) / 2; // Max radius for circles

        // Generate concentric circles
        const circles = Array.from({ length: numCircles }, (_, i) => {
            const radius = ((i + 1) / numCircles) * maxRadius;
            return <circle key={`circle-${i}`} cx={centerX} cy={centerY} r={radius} stroke="gray" fill="none" />;
        });

        // Generate radial lines
        const radialLines = Array.from({ length: numRadialLines }, (_, i) => {
            const angle = (i / numRadialLines) * 2 * Math.PI;
            const x = centerX + maxRadius * Math.cos(angle);
            const y = centerY + maxRadius * Math.sin(angle);
            return <line key={`radial-${i}`} x1={centerX} y1={centerY} x2={x} y2={y} stroke="gray" />;
        });

        return [...circles, ...radialLines];
    }, [usePolar, width, height]);

    const centerLine = useMemo(() => {
        if (!usePolar || !cursorX || !cursorY) return null;
        const centerX = width / 2;
        const centerY = height / 2;
        return (
            <line
                x1={centerX}
                y1={centerY}
                x2={cursorX}
                y2={cursorY}
                stroke="blue"
                strokeWidth={1.5}
                strokeOpacity={0.5} // Semi-transparent
            />
        );
    }, [cursorX, cursorY, width, height]);

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
            {!usePolar &&
            <div className={'graph-cursor-x'} style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: cursorX ?? 0,
                width: cursorX ? 1 : 0,
                backgroundColor: 'var(--accent-color)',
            }}/> }
            {!usePolar && <div className={'graph-cursor-y'} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: cursorY ?? 0,
                height: cursorY ? 1 : 0,
                backgroundColor: 'var(--accent-color)',
            }}/>}
          
            <svg style={{height: '100%', width: '100%'}}>
                {svgLines}
                {polarGrid} {/* Render polar grid if usePolar is true */}
                {centerLine} {/* Render the line from the center to the mouse */}
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
