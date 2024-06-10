import {useBoxRect} from "../../hooks/useBoxRect.ts";
import {useRef} from "react";
import {DrawingLine} from "./Drawing/DrawingLine.tsx";
import {Line} from "../../types/lines.ts";

const graphWidth = 20;
const graphHeight = 20;

type Props = {
    lines: Line[],
}

export function ResultPlane(props: Props): JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {height, width} = useBoxRect(boxRef);

    return (
        <div className={'graph-show graph-window'} ref={boxRef}>
            <svg style={{height: '100%', width: '100%'}}>
                {props.lines.map( line => (
                    <DrawingLine
                        key={line.id}
                        line={line.values}
                        height={height}
                        width={width}
                        graphHeight={graphHeight}
                        graphWidth={graphWidth}
                        color={line.color}
                    />
                ))}
            </svg>
        </div>
    );
}
