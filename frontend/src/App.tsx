import './Components/Graph/graph.css';
import {Graph} from "./Components/Graph/Graph.tsx";
import {Panel} from "./Components/ToolsPanel/Panel.tsx";
import {DrawingPlane} from "./Components/Graph/DrawingPlane.tsx";
import {ResultPlane} from "./Components/Graph/ResultPlane.tsx";
import {useEffect, useState} from "react";
import {zLabeledStrokes} from "./types/lines.ts";
import {useAppDispatch, useAppSelector} from "./hooks";
import {addResult, changeFunction} from "./store/action.ts";
import {scatterLine} from "./Components/Graph/Drawing/helpers.ts";
import {LineType} from "./types/const.ts";

async function getStrokes(z: zLabeledStrokes, f: string): Promise<zLabeledStrokes | null> {
    try {
        const response = await fetch("/strokes?" + new URLSearchParams({f: f}).toString(), {
            method: 'POST',
            body: JSON.stringify({z})
        });
        return response.status === 200 ? response.json() : null;
    } catch (e) {
        throw e;
    }
}

function App() {
    const [input, setInput] = useState('z');

    const lines = useAppSelector(state => state.lines);
    const result = useAppSelector(state => state.result);
    const f = useAppSelector(state => state.function);
    const drawRect = useAppSelector(state => state.drawingView);
    const resultRect = useAppSelector(state => state.resultView);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const newLines = lines.filter(line => !(result.map(r => r.id).includes(line.id)));
        newLines.length > 0 && getStrokes(newLines
                .map((line) => scatterLine(line))
                .map((line) => [line.id, line.values]), f).then(res => {
            if (res) {
                dispatch(addResult(res.map(([id, value]) => {
                    const proto = newLines.filter(l => l.id === id)[0];
                    return { id: id, values: value, color: proto.color, type: LineType.Sharp };
                })));
            }
        })
    }, [lines, f]);

    function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const {value} = evt.target;
        setInput(value);
    }

    return (
        <div className={"control-container"}>
            <Panel/>
            <div className={"graphs-container"}>
                <Graph viewRect={drawRect}>
                    <DrawingPlane/>
                </Graph>
                <Graph viewRect={resultRect}>
                    <ResultPlane/>
                </Graph>
            </div>

            <form className={'function-form'}>
                <span>f=</span>
                <input
                    name={'function'}
                    className={'function-string'}
                    placeholder={'Введите функцию'}
                    onChange={handleInputChange}
                    defaultValue={'z'}
                />
                <button
                    className={'function-button'}
                    onClick={(evt) => {
                        evt.preventDefault();
                        dispatch(changeFunction(input))
                }}
                >Посчитать</button>
            </form>
        </div>
    );
}

export default App;
