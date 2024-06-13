import {PropsWithChildren, useRef} from "react";
import {axisCoordsToPixelCoords, getCellSize, trimNumberString} from "./Drawing/helpers.ts";
import {ViewRectangle} from "../../types/const.ts";
import {useMousePositionOnPlane} from "../../hooks/useMousePositionOnPlane.ts";

type GraphProps = PropsWithChildren<{
    viewRect: ViewRectangle;
}>

function getLabels(lower: number, higher: number, cellSize: number): string[] {
    const labels: string[] = [];
    const start = lower + (cellSize * 5 - lower % (cellSize * 5));

    for (let i = start; i < higher; i += cellSize * 5) {
        labels.push(trimNumberString(i, cellSize));
    }
    return labels;
}

export function Graph({viewRect, ...props}: GraphProps): JSX.Element {
    const {top, bottom, right, left} = viewRect;
    const {x, y} = axisCoordsToPixelCoords(0, 0, {width: 100, height: 100}, viewRect);
    const boxRef = useRef<HTMLDivElement>(null);
    const {axisX, axisY} = useMousePositionOnPlane(viewRect, boxRef);

    const cellSizeX = getCellSize(right - left);
    const cellSizeY = getCellSize(top - bottom);

    const labelsX = getLabels(left, right, cellSizeX);
    const labelsY = getLabels(bottom, top, cellSizeY);
    const firsts = axisCoordsToPixelCoords(parseFloat(labelsX[0]), parseFloat(labelsY[0]), {width: 100, height: 100}, viewRect);
    const lasts = axisCoordsToPixelCoords(parseFloat(labelsX[labelsX.length-1]), parseFloat(labelsY[labelsY.length-1]), {width: 100, height: 100}, viewRect);
    let styleX = {paddingTop: '0'};
    let styleY = {paddingRight: '0', paddingLeft: '0', alignRight: false};
    if (bottom > 0) {
        styleX.paddingTop = 'calc(100% - 1em)';
    } else if (top > 0) {
        styleX.paddingTop = `calc(min(100% - 1em, ${y}%))`;
    }

    if (right < 0) {
        styleY.paddingLeft = '100%';
        styleY.alignRight = true;
    } else if (left < 0) {
        styleY.paddingLeft = `calc(min(100%, ${x}%))`;
    }

    return (
        <div className={"graph-container"}>
            <div className={"graph-mouse-coords-container"}>
                <span className={"graph-mouse-coords-label"}>{axisX ?? '-'}</span>
                <span className={"graph-mouse-coords-label"}>{axisY ?? '-'}</span>
            </div>
            <div className={"graph-box"}>
                <div
                    ref={boxRef}
                    className={'graph-grid graph-window'}
                    style={{
                        backgroundPosition: `${-(left % cellSizeX)*100/(right-left)}% ${(top % cellSizeY)*100/(top-bottom)}%`,
                        backgroundSize: `${100 / (right - left) * cellSizeX}% ${100 / (top - bottom) * cellSizeY}%`,
                    }}
                />
                <div
                    className={'graph-axis graph-window'}
                    style={{
                        backgroundImage:
                            `linear-gradient(to right, transparent calc(${x}% - 1px),` +
                            ` var(--axis-color) calc(${x}%), transparent calc(${x}% + 1px)),` +

                            `linear-gradient(to bottom, transparent calc(${y}% - 1px),` +
                            ` var(--axis-color) calc(${y}%), transparent calc(${y}% + 1px))`,
                    }}
                >
                    <ul
                        draggable={false}
                        className={'graph-labels graph-labels-x'}
                        style={{
                            paddingTop: styleX.paddingTop,
                            paddingRight: `${100-lasts.x}%`,
                            paddingLeft: `${firsts.x}%`,
                        }}
                    >
                        {labelsX.map(l => (
                            <li key={l} className={'graph-label-placeholder'}>
                                <p className={'graph-label graph-label-x'} style={{opacity: parseFloat(l) === 0 ? '0' : '0.7'}}>
                                    {l}
                                </p>
                            </li>))}
                    </ul>
                    <ul
                        draggable={false}
                        className={'graph-labels graph-labels-y'}
                        style={{
                            paddingTop: `${lasts.y}%`,
                            paddingRight: styleY.paddingRight,
                            paddingLeft: styleY.paddingLeft,
                            paddingBottom: `${100-firsts.y}%`,
                        }}
                    >
                        {labelsY.map(l => (
                            <li key={l} className={'graph-label-placeholder'}>
                                <p
                                    className={'graph-label graph-label-y'}
                                    style={{
                                        opacity: parseFloat(l) === 0 ? '0' : '0.7',
                                        right: styleY.alignRight ? '5px' : 'auto',
                                        left: styleY.alignRight ? 'auto' : '5px'
                                }}>
                                    {l}
                                </p>
                            </li>))}
                    </ul>
                </div>
                {props.children}
            </div>
        </div>
    );
}
