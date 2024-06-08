import './Components/Graph/graph.css';
import {Graph} from "./Components/Graph/Graph.tsx";
import './Components/ToolsPanel/tools.css'
import {Panel} from "./Components/ToolsPanel/Panel.tsx";
import {DrawingPlane} from "./Components/Graph/DrawingPlane.tsx";
import {ResultPlane} from "./Components/Graph/ResultPlane.tsx";
import {useEffect, useState} from "react";

export type zArray = [number, number][]

export type zLabeledStrokes = [number, zArray][]

async function getStrokes(z: zLabeledStrokes, f: string): Promise<zLabeledStrokes | null> {
    try {
        const response = await fetch("/strokes?" + new URLSearchParams({f: f}).toString(), {
            method: 'POST',
            body: JSON.stringify({z})
        });
        console.log(response)
        return response.json()
    } catch (e) {
        throw e;
    }
}

function App() {
    const [f, setf] = useState('z');
    const [strokes, setStrokes] = useState<zLabeledStrokes | null>(null);
    const [strokesRes, setStrokesRes] = useState<zLabeledStrokes>([]);
    const [input, setInput] = useState('z');

    useEffect(() => {
        strokes && getStrokes(strokes, f).then(res => {
            if (res) {
                setStrokesRes(res);
            }
        })
    }, [strokes, f]);

    function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const {value} = evt.target;
        setInput(value);
    }

    return (
        <div className={"control-container"}>
            <Panel/>
            <div className={"graphs-container"}>
                <Graph>
                    <DrawingPlane
                        graphHeight={20}
                        graphWidth={20}
                        onChangeStrokes={(stks) => setStrokes(stks)}/>
                </Graph>
                <Graph>
                    <ResultPlane strokes={strokesRes}/>
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
                        setf(input)
                }}
                >Посчитать</button>
            </form>
        </div>
    );
}

export default App;
