import "./function.css";
import {useState} from "react";
import {ComplexError} from "../../types/const.ts";
import { OverlayKeyboard } from "../OverlayKeyboard/OverlayKeyboard.tsx";

type Props = {
    error: ComplexError | null;
    warning?: ComplexError | null;
    onChange: (value: string) => void;
    polarMode: boolean;
}

export function FunctionForm({error, warning, onChange, polarMode}: Props): React.JSX.Element {
    const [input, setInput] = useState('z');
    const [showOverlay, setShowOverlay] = useState(false);

    function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const {value} = evt.target;
        setInput(value);
    }

    function handleSymbolSelect(symbol: string) {
        setInput((prev) => prev + symbol); 
    }

    function toggleOverlay() {
        setShowOverlay((prev) => !prev);
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
                value={input} // Control the input value
            />
            

            <button
                className={'function-button'}
                onClick={(evt) => {
                    evt.preventDefault();
                    onChange(input);
                }}
            >Посчитать
            </button>
            
            <button
                type="button"
                className={'function-button'}
                onClick={toggleOverlay}
            >
                Экранный ввод
            </button>

            {showOverlay && (
                <OverlayKeyboard
                    onSelect={handleSymbolSelect}
                    onClose={() => setShowOverlay(false)}
                />
            )}
        </form>
    );
}