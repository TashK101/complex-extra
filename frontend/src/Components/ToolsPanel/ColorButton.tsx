import {useAppDispatch, useAppSelector} from "../../hooks";
import {changeColor} from "../../store/action.ts";
import {ColorPicker} from "./ColorPicker.tsx";

export function ColorButton(): JSX.Element {
    const currentColor = useAppSelector(state => state.color);
    const dispatch = useAppDispatch();

    function handleChange(value: string): void {
        dispatch(changeColor(value));
    }

    return (
        <div className={"tool-button"} title={'Цвет'}>
            <ColorPicker
                value={currentColor}
                onChange={handleChange}
            />
        </div>
    );
}