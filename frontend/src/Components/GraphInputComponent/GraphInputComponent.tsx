import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../hooks/index.ts';
import {
    addUserFunction,
    removeUserFunction,
    updateUserFunction
} from '../../store/action.ts';
import "./GraphInputComponent.css";
import ArrowButton from './ArrowButton';
import { OverlayKeyboard } from "../OverlayKeyboard/OverlayKeyboard.tsx";

const buttonColors: string[] = [
    '#990000', '#997700', '#006600', '#000099', '#000000',
    '#ff2222', '#ff9922', '#22c555', '#2255ff', '#cccccc',
];

const GraphInputComponent = ({ onRecalcAll }) => {
    const dispatch = useAppDispatch();
    const inputs = useAppSelector(state => state.userFunctions);

    const [focusedInputId, setFocusedInputId] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [caretPos, setCaretPos] = useState<{ start: number; end: number } | null>(null);


    const overlayRef = useRef<HTMLDivElement | null>(null);
    const firstInputRef = useRef<HTMLInputElement | null>(null);
    const activeInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (showOverlay && firstInputRef.current) {
            firstInputRef.current.focus();
            setFocusedInputId(inputs[0]?.id ?? null);
        }
    }, [showOverlay, inputs]);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // If click is inside the keyboard, ignore
            if (overlayRef.current?.contains(target)) return;

            // If click is inside any input, ignore
            const isInput = (target instanceof HTMLElement) && target.tagName === 'INPUT';
            if (isInput) return;

            // Otherwise, it's outside
            setShowOverlay(false);
        };

        if (showOverlay) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOverlay]);

    useEffect(() => {
        if (inputs.length === 0) {
            dispatch(addUserFunction({
                id: uuidv4(),
                expression: 'z',
                color: buttonColors[0]
            }));
        }
    }, [inputs.length, dispatch]);

    const addInput = () => {
        const newColor = buttonColors[Math.floor(Math.random() * buttonColors.length)];
        dispatch(addUserFunction({
            id: uuidv4(),
            expression: 'z',
            color: newColor
        }));
    };

    const removeInput = (id: string) => {
        dispatch(removeUserFunction(id));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const newExpr = e.target.value;
        const func = inputs.find(f => f.id === id);
        if (!func) return;
        dispatch(updateUserFunction({
            id,
            newExpr,
            color: func.color,
        }));
    };

    const handleSymbolSelect = (symbol: string) => {
        const inputEl = activeInputRef.current;
        if (!inputEl || !focusedInputId || !caretPos) return;

        const { start, end } = caretPos;
        const before = inputEl.value.slice(0, start);
        const after = inputEl.value.slice(end);
        const newValue = before + symbol + after;

        // Set value manually
        inputEl.value = newValue;

        // Restore caret after insertion
        inputEl.focus();
        inputEl.setSelectionRange(start + symbol.length, start + symbol.length);
        setCaretPos({ start: start + symbol.length, end: start + symbol.length });

        // Update Redux
        const func = inputs.find(f => f.id === focusedInputId);
        if (!func) return;

        dispatch(updateUserFunction({
            id: func.id,
            newExpr: newValue,
            color: func.color,
        }));
    };



    const toggleOverlay = () => {
        setShowOverlay(prev => !prev);
    };

    const handleRecalcAll = () => {
        console.log('Recalculating all functions:', inputs);
        onRecalcAll();
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                width: '300px',
            }}
        >
            {inputs.map((input, index) => (
                <div className='input-cross-container' key={input.id}>
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '5px 10px',
                        }}
                    >
                        <input
                            ref={input.id === focusedInputId ? activeInputRef : null}
                            onFocus={(e) => {
                                setFocusedInputId(input.id);
                                activeInputRef.current = e.currentTarget;
                                const pos = {
                                    start: e.currentTarget.selectionStart ?? 0,
                                    end: e.currentTarget.selectionEnd ?? 0,
                                };
                                setCaretPos(pos);
                            }}
                            onSelect={(e) => {
                                const target = e.currentTarget;
                                setCaretPos({
                                    start: target.selectionStart ?? 0,
                                    end: target.selectionEnd ?? 0,
                                });
                            }}
                            type="text"
                            value={input.expression}
                            onChange={(e) => handleInputChange(e, input.id)}
                            placeholder="Введите функцию"
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '5px',
                                outline: 'none',
                            }}
                        />
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: input.color,
                                marginLeft: 10,
                            }}
                        />
                    </div>
                    <button
                        onClick={() => removeInput(input.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'grey',
                            cursor: 'pointer',
                            marginLeft: '5px',
                        }}
                        aria-label="Remove function"
                    >
                        X
                    </button>
                </div>
            ))}

            <div
                className='input-cross-container'
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                <button
                    onClick={addInput}
                    style={{
                        padding: '10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        flexGrow: 1,
                    }}
                >
                    Добавить функцию
                </button>
                <ArrowButton
                    onClick={handleRecalcAll}
                    backgroundColor='#111166'
                    isDots={false}
                />
            </div>

            <button
                onClick={toggleOverlay}
                style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    marginTop: '10px',
                }}
            >
                Экранный ввод
            </button>

            {showOverlay && (
                <div ref={overlayRef}>
                    <OverlayKeyboard
                        onSelect={handleSymbolSelect}
                        onClose={() => setShowOverlay(false)}
                    />
                </div>
            )}
        </div>
    );
};

export default GraphInputComponent;
