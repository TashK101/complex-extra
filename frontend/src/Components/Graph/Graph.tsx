import {PropsWithChildren} from "react";
import {axisCoordsToPixelCoords} from "./Drawing/helpers.ts";

type GraphProps = PropsWithChildren<{
    viewRect: { top: number, left: number, bottom: number, right: number };
}>

function getCellSize(size: number): number {
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

export function Graph({viewRect, ...props}: GraphProps): JSX.Element {
    const {top, bottom, right, left} = viewRect;
    const {x, y} = axisCoordsToPixelCoords(0, 0, {width: 100, height: 100}, viewRect);

    const cellSizeX = getCellSize(right - left);
    const cellSizeY = getCellSize(top - bottom);
    const relX = 100 / (right - left);
    const relY = 100 / (top - bottom);

    const labelsX: number[] = [];
    const labelsY: number[] = [];
    const startX = left + (cellSizeX * 5 - left % (cellSizeX * 5));
    const startY = bottom + (cellSizeY * 5 - bottom % (cellSizeY * 5));

    for (let i = startX; i < right; i += cellSizeX * 5) {
        labelsX.push(i);
    }
    for (let i = startY; i < top; i += cellSizeY * 5) {
        labelsY.push(i);
    }

    const firsts = axisCoordsToPixelCoords(labelsX[0], labelsY[0], {width: 100, height: 100}, viewRect);
    const lasts = axisCoordsToPixelCoords(labelsX[labelsX.length-1], labelsY[labelsY.length-1], {width: 100, height: 100}, viewRect);
    let styleX = {paddingTop: '0', paddingRight: '0', paddingLeft: '0'};
    let styleY = {paddingTop: '0', paddingRight: '0', paddingLeft: '0', paddingBottom: '0', alignRight: false};
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
    styleX.paddingLeft = `${firsts.x}%`;
    styleX.paddingRight = `${100-lasts.x}%`;
    styleY.paddingTop = `${100-firsts.y}%`;
    styleY.paddingBottom = `${lasts.y}%`;

    return (
        <div>
            <div className={"graph-box"}>
                <div
                    className={'graph-grid graph-window'}
                    style={{
                        backgroundPosition: `${-(left % cellSizeX) * relX}% ${(top % cellSizeY) * relY}%`,
                        backgroundSize: `${relX * cellSizeX}% ${relY * cellSizeY}%`,
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
                        className={'graph-labels graph-labels-x'}
                        style={{
                            paddingTop: styleX.paddingTop,
                            paddingRight: styleX.paddingRight,
                            paddingLeft: styleX.paddingLeft,
                        }}
                    >
                        {labelsX.map(l => (
                            <li key={l} className={'graph-label-placeholder'}>
                                <p className={'graph-label graph-label-x'} style={{opacity: l === 0 ? '0' : '0.7'}}>
                                    {l}
                                </p>
                            </li>))}
                    </ul>
                    <ul
                        className={'graph-labels graph-labels-y'}
                        style={{
                            paddingTop: styleY.paddingTop,
                            paddingRight: styleY.paddingRight,
                            paddingLeft: styleY.paddingLeft,
                            paddingBottom: styleY.paddingBottom,
                        }}
                    >
                        {labelsY.map(l => (
                            <li key={l} className={'graph-label-placeholder'}>
                                <p
                                    className={'graph-label graph-label-y'}
                                    style={{
                                        opacity: l === 0 ? '0' : '0.7',
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
