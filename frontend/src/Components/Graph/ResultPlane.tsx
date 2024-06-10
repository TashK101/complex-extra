import {useBoxRect} from "../../hooks/useBoxRect.ts";
import {useRef} from "react";
import {Line} from "../../types/lines.ts";
import {DrawLine} from "./Drawing/DrawLine.ts";
import {useAppSelector} from "../../hooks";

type Props = {
    lines: Line[],
}

export function ResultPlane(props: Props): JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {height, width} = useBoxRect(boxRef);
    const viewRect = useAppSelector(state => state.resultView);

    return (
        <div className={'graph-show graph-window'} ref={boxRef}>
            <svg style={{height: '100%', width: '100%'}}>
                {props.lines.map( line => (
                    <DrawLine
                        key={line.id}
                        line={line}
                        viewRect={viewRect}
                        box={{width, height}}
                    />
                ))}
            </svg>
        </div>
    );
}
