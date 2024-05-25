import './Components/graph.css';
import {Graph} from "./Components/Graph.tsx";
import {Panel} from "./Components/panel.tsx";
import {DrawGraph} from "./Components/draw-graph.tsx";
import {ShowGraph} from "./Components/show-graph.tsx";
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

const fStrings = ["f(z)=2z+1", "f(z)=exp(z)", "f(z)=ln(z)"];

function App() {
    const [f, setf] = useState(fStrings[1]);
    const [strokes, setStrokes] = useState<zLabeledStrokes|null>(null);
    const [strokesRes, setStrokesRes] = useState<zLabeledStrokes>([]);

    useEffect(() => {
        strokes && getStrokes(strokes, f).then(res => {
            if (res) {
                setStrokesRes(res);
            }
        })
    }, [strokes, f]);

    return (
        <div className={"control-container"}>
            <Panel/>
            <div className={"graphs-container"}>
                <Graph>
                    <DrawGraph graphHeight={20} graphWidth={20} onChangeStrokes={(stks)=>setStrokes(stks)}/>
                </Graph>
                <Graph>
                    <ShowGraph strokes={strokesRes}/>
                </Graph>
            </div>
        </div>
    );
}

export default App;
