import { Graph } from "../Components/Graph/Graph.tsx";
import Panel from "../Components/ToolsPanel/Panel.tsx";
import { DrawingPlane } from "../Components/Graph/DrawingPlane.tsx";
import { ResultPlane } from "../Components/Graph/ResultPlane.tsx";
import { useEffect, useState } from "react";
import { Line, zLabeledStrokes } from "../types/lines.ts";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addResult, resizeDrawing, resizeResult } from "../store/action.ts";
import { scatterLine } from "../Components/Graph/Drawing/helpers.ts";
import { ComplexError, ErrorType, LineType } from "../types/const.ts";
import { GraphSettings } from "../Components/Graph/GraphSettings.tsx";
import "./Main.css"
import GraphInputComponent from "../Components/GraphInputComponent/GraphInputComponent.tsx";
import { ZoomableGraphWrapper } from "../Components/Graph/ZoomableGraphWrapper.tsx";

const errorRegex = '^(\\d+)\\s(.*)';

function getErrorType(errorCode: string): ErrorType {
    switch (errorCode) {
        case '1': return ErrorType.UnknownToken;
        case '2': return ErrorType.TooManyVariables;
        case '3': return ErrorType.NotImplemented;
        case '4': return ErrorType.InvalidExpression;
        default: return ErrorType.Unknown;
    }
}

function resultIsLabeledStrokes(maybeLabeledStrokes: any): maybeLabeledStrokes is zLabeledStrokes {
    return maybeLabeledStrokes instanceof Array;
}

async function getStrokes(z: zLabeledStrokes, f: string, lnBranches: number): Promise<zLabeledStrokes | ComplexError> {
    try {
        const response = await fetch("https://complex.pythonanywhere.com/strokes?" + new URLSearchParams({ f: f }).toString(), {
            method: 'POST',
            body: JSON.stringify({ z, lnBranches }),
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
    const [usePolar, setUsePolar] = useState(false);
    const [useRadian, setUseRadian] = useState(false);
    const [recalcAllTrigger, setRecalcAllTrigger] = useState(0);

    const lines = useAppSelector(state => state.lines);
    const result = useAppSelector(state => state.result);
    const activeTool = useAppSelector(state => state.tool);
    const drawRect = useAppSelector(state => state.drawingView);
    const resultRect = useAppSelector(state => state.resultView);
    const userFunctions = useAppSelector(state => state.userFunctions);
    const lnBranches = useAppSelector(state => state.lnBranches);

    const triggerRecalcAll = () => setRecalcAllTrigger(prev => prev + 1);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userFunctions.length === 0) {
            dispatch(addResult([]));
            return;
        }


        const inputLines = recalcAllTrigger > 0 ? lines : lines.filter(line => !result.some(r => r.id === line.id));

        if (inputLines.length === 0) {
            dispatch(addResult([]));
            return;
        }

        const fetches = userFunctions.map(({ id: funcId, expression, color }) => {
            const lowerExpr = expression.toLowerCase();
            return getStrokes(
                inputLines.map(line => scatterLine(line, 0.01)).map(line => [line.id, line.values]),
                lowerExpr,
                lnBranches
            ).then(res => ({ res, color, funcId }));
        });

        Promise.all(fetches).then(resultsWithColors => {
            const currentFuncIds = userFunctions.map(f => f.id);
            let updatedResults: Line[] = result.filter(line => currentFuncIds.includes(line.ownerFuncId));

            for (const { res, color, funcId } of resultsWithColors) {
                // Remove all previous lines for this function
                updatedResults = updatedResults.filter(
                    line => line.ownerFuncId !== funcId
                );

                if (!res || !resultIsLabeledStrokes(res)) continue;

                const newLines = res.map(([id, value]) => {
                    const proto = lines.find(l => l.id === id);
                    return {
                        id: Math.floor(Math.random() * 1e9), // still numeric
                        values: value,
                        color,
                        type: proto?.type === LineType.Dot ? LineType.Dot : LineType.Sharp,
                        ownerFuncId: funcId,
                    };
                });

                updatedResults.push(...newLines);
            }

            dispatch(addResult(updatedResults));
        });

    }, [lines, userFunctions, recalcAllTrigger]);



    return (
        <div className="control-container">
            <Panel />
            <div className="flex moved-left">
                <GraphInputComponent onRecalcAll={triggerRecalcAll} onPolarChange={setUsePolar} onRadianChange={setUseRadian} />
            </div>
            <div className="graphs-container">
                <div className="flex">
                    <div className='graph-with-settings'>
                        <ZoomableGraphWrapper viewRect={drawRect} changeViewRect={(rect) => dispatch(resizeDrawing(rect))} activeTool={activeTool}>
                            <GraphSettings viewRect={drawRect} changeViewRect={(rect) => dispatch(resizeDrawing(rect))} />
                            <Graph viewRect={drawRect} polarMode={usePolar} radianMode={useRadian}>
                                <DrawingPlane usePolar={usePolar} />
                            </Graph>
                        </ZoomableGraphWrapper>
                    </div>
                </div>
                <div className='graph-with-settings'>
                    <ZoomableGraphWrapper viewRect={resultRect} changeViewRect={(rect) => dispatch(resizeResult(rect))} activeTool={activeTool}>
                        <GraphSettings viewRect={resultRect} changeViewRect={(rect) => dispatch(resizeResult(rect))} />
                        <Graph viewRect={resultRect} polarMode={usePolar} radianMode={useRadian}>
                            <ResultPlane />
                        </Graph>
                    </ZoomableGraphWrapper>
                </div>
            </div>
        </div>
    );
}

export default Main;
