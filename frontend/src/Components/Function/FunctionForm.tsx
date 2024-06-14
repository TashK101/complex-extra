import "./function.css";
import {useState} from "react";
import {ComplexError} from "../../types/const.ts";

type Props = {
    error: ComplexError | null;
    warning?: ComplexError | null;
    onChange: (value: string) => void;
}

export function FunctionForm({error, warning, onChange}: Props): React.JSX.Element {
    const [input, setInput] = useState('z');

    function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const {value} = evt.target;
        setInput(value);
    }

    return (
        <form className={error
            ? 'function-form function-form-error'
            : warning
                ? 'function-form function-form-warning'
                : 'function-form'}>
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
                    onChange(input);
                }}
            >Посчитать
            </button>
        </form>
    );
}