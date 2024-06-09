import {useAppDispatch} from "../../hooks";
import {eraseAll} from "../../store/action.ts";
import {IconTrash} from "../../Icons/IconTrash.tsx";


export function DeleteButton(): JSX.Element {
    const dispatch = useAppDispatch();

    function handleClick (evt: React.MouseEvent<HTMLButtonElement>): void {
        evt.preventDefault();
        dispatch(eraseAll());
    }

    return (
        <button className={"tool-button"} title={'Очистить'} onClick={handleClick}>
            <IconTrash/>
        </button>
    );
}