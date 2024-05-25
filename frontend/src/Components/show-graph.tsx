import {useBoxRect} from "../hooks/hooks.ts";
import {useRef} from "react";
import {DrawingLine} from "./drawing-line.tsx";
import {zLabeledStrokes} from "../App.tsx";

const graphWidth = 20;
const graphHeight = 20;

type Props = {
    strokes: zLabeledStrokes,
}

export function ShowGraph(props: Props): JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {height, width} = useBoxRect(boxRef);

    return (
        <div className={'graph-show graph-window'} ref={boxRef}>
            <svg style={{height: '100%', width: '100%'}}>
                {props.strokes.map( ms => ms[1] && ms[1].length > 0 && (
                    <DrawingLine
                        key={ms[0]}
                        line={ms[1]}
                        height={height}
                        width={width}
                        graphHeight={graphHeight}
                        graphWidth={graphWidth}
                    />
                ))}
            </svg>
        </div>
    );
}
