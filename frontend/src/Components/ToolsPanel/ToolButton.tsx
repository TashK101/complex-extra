import { PropsWithChildren } from "react";
import { Tool } from "../../types/const.ts";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { changeTool } from "../../store/action.ts";

type Props = PropsWithChildren<{
    tool: Tool,
    description: string,
}>

export function ToolButton(props: Props): JSX.Element {
    const currentTool = useAppSelector(state => state.tool);
    const dispatch = useAppDispatch();

    function handleClick(evt: React.MouseEvent<HTMLButtonElement>): void {
        evt.preventDefault();
        dispatch(changeTool(props.tool));
    }

    return (
        <button
            className={`tool-button${currentTool === props.tool ? ' tool-button-active' : ''}`}
            title={props.description}
            onClick={handleClick}
            tabIndex={0} 
        >
            {props.children}
        </button>

    );
}