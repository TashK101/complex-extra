import {useAppDispatch, useAppSelector} from "../../hooks";
import {changeColor} from "../../store/action.ts";

export function ColorButton(): JSX.Element {
    const currentColor = useAppSelector(state => state.color);
    const dispatch = useAppDispatch();

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        dispatch(changeColor(evt.target.value));
    }

    return (
        <div className={"tool-button"} title={'Цвет'}>
            <input
                type={'color'}
                className={'color-tool'}
                onChange={handleChange}
                value={currentColor}
            />
        </div>
    );
}