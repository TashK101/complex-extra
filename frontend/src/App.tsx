import './Components/Graph/graph.css';
import {Graph} from "./Components/Graph/Graph.tsx";
import {Panel} from "./Components/ToolsPanel/Panel.tsx";
import {DrawingPlane} from "./Components/Graph/DrawingPlane.tsx";
import {ResultPlane} from "./Components/Graph/ResultPlane.tsx";
import {useEffect, useState} from "react";
import {zLabeledStrokes} from "./types/lines.ts";
import {useAppDispatch, useAppSelector} from "./hooks";
import {addResult, changeFunction, resizeDrawing, resizeResult} from "./store/action.ts";
import {scatterLine} from "./Components/Graph/Drawing/helpers.ts";
import {ComplexError, ErrorType, LineType} from "./types/const.ts";
import {FunctionForm} from "./Components/Function/FunctionForm.tsx";
import {GraphSettings} from "./Components/Graph/GraphSettings.tsx";

const errorRegex = '^(\\d+)\\s(.*)';

function getErrorType(errorCode: string): ErrorType {
    switch (errorCode) {
        case '1':
            return ErrorType.UnknownToken;
        case '2':
            return ErrorType.TooManyVariables;
        case '3':
            return ErrorType.NotImplemented;
        case '4':
            return ErrorType.InvalidExpression;
        default:
            return ErrorType.Unknown;
    }
}

function resultIsLabeledStrokes(maybeLabeledStrokes: any): maybeLabeledStrokes is zLabeledStrokes {
    return maybeLabeledStrokes instanceof Array;
}

async function getStrokes(z: zLabeledStrokes, f: string): Promise<zLabeledStrokes | ComplexError> {
    try {
        const response = await fetch("/strokes?" + new URLSearchParams({f: f}).toString(), {
            method: 'POST',
            body: JSON.stringify({z})
        });
        if (response.status === 200) {
            return response.json();
        }
        if (response.status === 400) {
            const responseError = await response.text().then(text => text.match(errorRegex));
            if (responseError) {
                return {errorType: getErrorType(responseError[1]), errorText: responseError[2]}
            }
        }
        if (response.status === 500) {
            const cantConnect = await response.text().then(text => text.startsWith('Proxy error'));
            if (cantConnect) {
                return {errorType: ErrorType.CannotConnect}
            }
        }
        return {errorType: ErrorType.Unknown}
    } catch (e) {
        return {errorType: ErrorType.Unknown}
    }
}

function App() {
    const [error, setError] = useState<ComplexError | null>(null);
    const [warning, setWarning] = useState<ComplexError | null>(null);
    const [f, setF] = useState<string>('z');

    const lines = useAppSelector(state => state.lines);
    const storedFunction = useAppSelector(state => state.function);
    const result = useAppSelector(state => state.result);
    const drawRect = useAppSelector(state => state.drawingView);
    const resultRect = useAppSelector(state => state.resultView);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const currentFunction = f.toLowerCase();
        const newLines = currentFunction === storedFunction
            ? lines.filter(line => !(result.map(r => r.id).includes(line.id)))
            : lines;
        getStrokes(newLines
            .map((line) => scatterLine(line, 0.01))
            .map((line) => [line.id, line.values]), currentFunction).then(res => {
            if (res) {
                if (!resultIsLabeledStrokes(res)) {
                    res.errorType === ErrorType.CannotConnect ? setWarning(res) : setError(res);
                    return;
                }
                setError(null);
                setWarning(null);
                if (currentFunction !== storedFunction) {
                    dispatch(changeFunction(currentFunction));
                }
                dispatch(addResult(res.map(([id, value]) => {
                    const proto = newLines.filter(l => l.id === id)[0];
                    return {
                        id: id,
                        values: value,
                        color: proto.color,
                        type: proto.type === LineType.Dot ? LineType.Dot : LineType.Sharp
                    };
                })));
            }
        })
    }, [lines, f]);

    return (
        <div className={"control-container"}>
            <Panel/>
            <div className={"graphs-container"}>
                <div className={'graph-with-settings'}>
                    <GraphSettings viewRect={drawRect} changeViewRect={(rect) => dispatch(resizeDrawing(rect))}/>
                    <Graph viewRect={drawRect}>
                        <DrawingPlane/>
                    </Graph>
                </div>
                <div className={'graph-with-settings'}>
                    <GraphSettings viewRect={resultRect} changeViewRect={(rect) => dispatch(resizeResult(rect))}>
                        <FunctionForm error={error} warning={warning} onChange={(value) => setF(value)}/>
                    </GraphSettings>
                    <Graph viewRect={resultRect}>
                        <ResultPlane/>
                    </Graph>
                </div>
            </div>
        </div>
    );
}

export default App;
