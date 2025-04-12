
import { Graph } from "../Components/Graph/Graph.tsx";
import Panel from "../Components/ToolsPanel/Panel.tsx";
import { DrawingPlane } from "../Components/Graph/DrawingPlane.tsx";
import { ResultPlane } from "../Components/Graph/ResultPlane.tsx";
import { useEffect, useState } from "react";
import { zLabeledStrokes } from "../types/lines.ts";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addResult, changeFunction, resizeDrawing, resizeResult } from "../store/action.ts";
import { scatterLine } from "../Components/Graph/Drawing/helpers.ts";
import { ComplexError, ErrorType, LineType } from "../types/const.ts";
import { FunctionForm } from "../Components/Function/FunctionForm.tsx";
import { GraphSettings } from "../Components/Graph/GraphSettings.tsx";
import "./Main.css"


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
        const response = await fetch("https://complex.pythonanywhere.com/strokes?" + new URLSearchParams({ f: f }).toString(), {
            method: 'POST',
            body: JSON.stringify({ z }),
        });

        if (response.status === 200) {
            return response.json();
        }

        if (response.status === 400) {
            const responseError = await response.text().then((text) => text.match(errorRegex));
            if (responseError) {
                const errorMessage = responseError[2];
                const errorType = getErrorType(responseError[1]);
                return { errorType, errorText: errorMessage };
            }
        }

        if (response.status === 500) {
            const cantConnect = await response.text().then((text) => text.startsWith('Proxy error'));
            if (cantConnect) {
                return { errorType: ErrorType.CannotConnect };
            }
        }

        return { errorType: ErrorType.Unknown };
    } catch (e) {
        return { errorType: ErrorType.Unknown };
    }
}

function Main() {
    const [error, setError] = useState<ComplexError | null>(null);
    const [warning, setWarning] = useState<ComplexError | null>(null);
    const [f, setF] = useState<string>('z');
    const [usePolar, setUsePolar] = useState(false);
    const [useRadian, setUseRadian] = useState(false);

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
                        if (res.errorType === ErrorType.CannotConnect) {
                            setWarning(res);
                            setError(null);
                        } else {
                            setError(res);
                            setWarning(null);
                        }
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
        <div className="control-container">
            <Panel />
            <div className="flex moved-left">
                <FunctionForm polarMode={usePolar} error={error} warning={warning} onChange={(value) => setF(value)} />
                    <div className='flex polar-label'>
                        <label>
                            <input
                                type="checkbox"
                                checked={usePolar}
                                onChange={(e) => setUsePolar(e.target.checked)}
                                title="Ввод в полярных координатах"
                            />
                            Полярные координаты
                        </label>
                        {usePolar ?
                            <label>
                                <input
                                    type="checkbox"
                                    checked={useRadian}
                                    onChange={(e) => setUseRadian(e.target.checked)}
                                    title="Радианная мера"
                                />
                                Радианная мера
                            </label>
                            :
                            null
                        }
                    </div>
                </div>
            <div className="graphs-container">

                <div className='flex'>
                    
                    <div className={'graph-with-settings'}>
                        <GraphSettings viewRect={drawRect} changeViewRect={(rect) => dispatch(resizeDrawing(rect))} />
                        <Graph viewRect={drawRect} polarMode={usePolar} radianMode={useRadian}>
                            <DrawingPlane usePolar={usePolar} />
                        </Graph>
                    </div>
                </div>
                <div className={'graph-with-settings'}>

                    <GraphSettings viewRect={resultRect} changeViewRect={(rect) => dispatch(resizeResult(rect))}>

                    </GraphSettings>
                    <Graph viewRect={resultRect} polarMode={usePolar} radianMode={useRadian}>
                        <ResultPlane usePolar={usePolar} />
                    </Graph>
                </div>
            </div>
        </div>
    );
}

export default Main;
