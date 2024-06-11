import {PropsWithChildren} from "react";
import {axisCoordsToPixelCoords} from "./Drawing/helpers.ts";

type GraphProps = PropsWithChildren<{
    viewRect: {top: number, left: number, bottom: number, right: number};
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
    const {x, y} = axisCoordsToPixelCoords(0,0, {width: 100, height:100}, viewRect);

    const cellSizeX = getCellSize(right - left);
    const cellSizeY = getCellSize(top - bottom);
    const relX = 100 / (right - left);
    const relY = 100 / (top - bottom);

    return (
        <div>
            <div className={"graph-box"}>
                <div
                    className={'graph-grid graph-window'}
                    style={{
                        backgroundPosition: `${-(left % cellSizeX) * relX}% ${(top % cellSizeY) * relY}%`,
                        backgroundSize: `${relX*cellSizeX}% ${relY*cellSizeY}%`,
                    }}
                />
                <div
                    className={'graph-axis graph-window'}
                    style={{
                        backgroundImage:
                            'linear-gradient(to right,' +
                            ` transparent calc(${x}% - 1px),` +
                            ` var(--axis-color) calc(${x}%),` +
                            ` transparent calc(${x}% + 1px)),` +

                            'linear-gradient(to bottom,' +
                            ` transparent calc(${y}% - 1px),` +
                            ` var(--axis-color) calc(${y}%),` +
                            ` transparent calc(${y}% + 1px))`,
                    }}
                />
                {props.children}
            </div>
        </div>
    );
}
