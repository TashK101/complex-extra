import {PropsWithChildren} from "react";

type GraphProps = PropsWithChildren<{}>

export function Graph(props: GraphProps): JSX.Element {

    return (
        <div>
            <div className={"graph-box"}>
                <div className={'graph-grid graph-window'}/>
                <div className={'graph-axis graph-window'}/>
                {props.children}
            </div>
        </div>
    );
}
