import './Components/graph.css';
import {useEffect, useState} from "react";
import {Graph} from "./Components/Graph.tsx";

async function getImage(xy:string, f:string) {
  return await fetch("/image?" + new URLSearchParams({xy: xy, f: f}).toString());
}

const xyStrings = ["x^2-y^2=0", "x^2+y^2=1"];
const fStrings = ["f(z)=2z+1", "f(z)=exp(z)", "f(z)=ln(z)"];

function App() {
    const [xy, setxy] = useState(xyStrings[0]);
    const [f, setf] = useState(fStrings[0]);
    const [graph1, setgraph1] = useState<string>("");
    const [graph2, setgraph2] = useState<string>("");

  useEffect(() => {
    getImage(xy, f).then(res => res.json()).then(res => {
      if (res) {
          setgraph1(res[0]);
          setgraph2(res[1]);
      }
      console.log(res)
    });
    }, [xy, setxy, f, setf, graph1, graph2, setgraph1, setgraph2]);

  return (
    <div style={{display: "flex"}}>
      <Graph
          imgString={graph1}
          onChange={val => setxy(val)}
          options={xyStrings}
      />
      <Graph
          imgString={graph2}
          onChange={val => setf(val)}
          options={fStrings}
      />
    </div>
  );
}

export default App;
