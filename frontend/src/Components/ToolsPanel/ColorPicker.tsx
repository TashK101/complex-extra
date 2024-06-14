import React, {useState} from "react";
import './tools.css';

type Props = {
    value: string;
    onChange: (value: string) => void;
}

function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const suggestedColors: string[] = [
    '#990000',
    '#997700',
    '#006600',
    '#000099',
    '#000000',
    '#ff2222',
    '#ff9922',
    '#22c555',
    '#2255ff',
    '#cccccc',
]

export function ColorPicker({value, onChange}: Props): React.JSX.Element {
    const [hexValue, setHexValue] = useState<string>(value);
    const [showMenu, setShowMenu] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>(value);


    function handleHexValueChange(hex: string) {
        setCurrentValue(hex);
        if (!hexToRgb(hex)) {
            return;
        }
        hex = hex.length === 7 ? hex : `#${hex}`;
        setHexValue(hex);
        onChange(hex);
    }

    function handleValueChange(evt: React.ChangeEvent<HTMLInputElement>) {
        evt.stopPropagation();
        handleHexValueChange(evt.target.value);
    }

    function handleBlur(evt: React.FocusEvent) {
        if (!evt.currentTarget.contains(evt.relatedTarget)) {
            setShowMenu(false)
        }
    }

    return (
        <div
            className="color-picker-icon"
            style={{backgroundColor: hexValue}}
            onClick={() => setShowMenu(!showMenu)}
            tabIndex={0}
            onBlur={handleBlur}>
            {showMenu && (
                <div className="color-picker-menu">
                    <div className='color-options-container'>
                        {suggestedColors.map(c => (
                        <div
                            key={c}
                            className={'color-option'}
                            style={{backgroundColor: c}}
                            onClick={() => handleHexValueChange(c)}
                        />))}
                    </div>
                    <input maxLength={7} className={'color-picker-hex'} value={currentValue}
                           onChange={handleValueChange}
                           onClick={(evt) => evt.stopPropagation()}
                    />
                </div>
            )}
        </div>);
}