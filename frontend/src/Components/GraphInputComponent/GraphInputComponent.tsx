import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Keyboard, Plus, Settings } from 'lucide-react';
import IconButton from '../IconButton/IconButton.tsx';
import SettingsOverlay from '../SettingsOverlay/SettingsOverlay.tsx';
import FunctionOverlayBox from '../FunctionOverlayBox/FunctionOverlayBox.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../../hooks/index.ts';
import {
    addUserFunction,
    changeLnBranches,
    removeUserFunction,
    updateUserFunction
} from '../../store/action.ts';
import "./GraphInputComponent.css";
import { OverlayKeyboard } from "../OverlayKeyboard/OverlayKeyboard.tsx";
import { SymbolMap } from '../OverlayKeyboard/SymbolMap.tsx';

const buttonColors: string[] = [
    '#990000', '#997700', '#006600', '#000099', '#000000',
    '#ff2222', '#ff9922', '#22c555', '#2255ff', '#cccccc',
];

function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const pastel = `hsl(${hue}, 70%, 75%)`;
    return pastel;
}

interface GraphInputComponentProps {
    onRecalcAll: () => void;
    onPolarChange: (value: boolean) => void;
    onRadianChange: (value: boolean) => void;
}

const GraphInputComponent = ({ onRecalcAll, onPolarChange, onRadianChange }: GraphInputComponentProps) => {
    const dispatch = useAppDispatch();
    const inputs = useAppSelector(state => state.userFunctions);

    const [focusedInputId, setFocusedInputId] = useState<string | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [caretPos, setCaretPos] = useState<{ start: number; end: number } | null>(null);

    const overlayRef = useRef<HTMLDivElement | null>(null);
    const activeInputRef = useRef<HTMLInputElement | null>(null);
    const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
    const settingsRef = useRef<HTMLDivElement | null>(null);
    const settingsButtonRef = useRef<HTMLButtonElement | null>(null);

    const lnBranches = useAppSelector(state => state.lnBranches);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        polar: false,
        radians: false,
        overlayDisplay: false
    });

    const handleLnBranchesChange = (value: number) => {
        dispatch(changeLnBranches(value));
    };


    useEffect(() => {
        if (showOverlay && inputs.length > 0 && caretPos === null) {
            const last = inputs[inputs.length - 1];
            setFocusedInputId(last.id);

            setTimeout(() => {
                activeInputRef.current?.focus();
                const pos = activeInputRef.current?.value.length ?? 0;
                activeInputRef.current?.setSelectionRange(pos, pos);
                setCaretPos({ start: pos, end: pos });
            }, 0);
        }
    }, [showOverlay, inputs, caretPos]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                overlayRef.current?.contains(target) ||
                toggleButtonRef.current?.contains(target) ||
                (target instanceof HTMLElement && target.closest('.input-row'))
            ) {
                return;
            }

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

    useEffect(() => {
        const handleClickOutsideSettings = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                settingsRef.current?.contains(target) ||
                settingsButtonRef.current?.contains(target)
            ) {
                return;
            }

            setShowSettings(false);
        };

        if (showSettings) {
            document.addEventListener('mousedown', handleClickOutsideSettings);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsideSettings);
        };
    }, [showSettings]);

    const addInput = () => {
        const newId = uuidv4();
        const usedColors = inputs.map(f => f.color);
        const availableColors = buttonColors.filter(c => !usedColors.includes(c));
        const newColor = availableColors.length > 0
            ? availableColors[0]
            : getRandomColor();
        dispatch(addUserFunction({
            id: newId,
            expression: 'z',
            color: newColor
        }));
        setFocusedInputId(newId);
        setCaretPos(null);
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

    const handleSymbolSelect = (symbolKey: string) => {
        const inputEl = activeInputRef.current;
        if (!inputEl || !focusedInputId || !caretPos) return;

        const { insert, cursorOffset } = SymbolMap[symbolKey];
        const { start, end } = caretPos;

        const before = inputEl.value.slice(0, start);
        const after = inputEl.value.slice(end);
        const newValue = before + insert + after;

        inputEl.value = newValue;
        inputEl.focus();

        const newCaret = start + cursorOffset;
        inputEl.setSelectionRange(newCaret, newCaret);
        setCaretPos({ start: newCaret, end: newCaret });

        const func = inputs.find(f => f.id === focusedInputId);
        if (!func) return;

        dispatch(updateUserFunction({
            id: func.id,
            newExpr: newValue,
            color: func.color,
        }));
    };

    const toggleOverlay = () => {
        setTimeout(() => {
            setShowOverlay(prev => !prev);
        }, 0);
    };

    const handleSettingToggle = (key: keyof typeof settings) => {
        const updated = {
            ...settings,
            [key]: !settings[key],
            ...(key === 'polar' && settings[key] ? { radians: false } : {})
        };
        setSettings(updated);

        if (key === 'polar') onPolarChange(updated.polar);
        if (key === 'radians') onRadianChange(updated.radians);
    };



    const handleRecalcAll = () => {
        onRecalcAll();
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',

                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                width: '300px',
            }}
        >
            {inputs.map((input) => (
                <div className="input-row" key={input.id}>
                    <div className="input-inner">
                        <input
                            ref={input.id === focusedInputId ? activeInputRef : null}
                            value={input.expression}
                            type="text"
                            placeholder="Введите функцию"
                            onFocus={(e) => {
                                setFocusedInputId(input.id);
                                activeInputRef.current = e.currentTarget;
                                setCaretPos({
                                    start: e.currentTarget.selectionStart ?? 0,
                                    end: e.currentTarget.selectionEnd ?? 0,
                                });
                            }}
                            onSelect={(e) => {
                                const target = e.currentTarget;
                                setCaretPos({
                                    start: target.selectionStart ?? 0,
                                    end: target.selectionEnd ?? 0,
                                });
                            }}
                            onChange={(e) => handleInputChange(e, input.id)}
                        />
                        <div className="color-dot" style={{ backgroundColor: input.color }} />
                        <button className="remove-btn" onClick={() => removeInput(input.id)}>
                            ×
                        </button>
                    </div>
                </div>
            ))}

            <div className="icon-button-row">
                <IconButton
                    icon={<Plus size={20} />}
                    onClick={addInput}
                    title="Добавить функцию"
                    variant="secondary"
                />
                <IconButton
                    icon={<Keyboard size={20} />}
                    onClick={toggleOverlay}
                    title={showOverlay ? 'Скрыть экранный ввод' : 'Экранный ввод'}
                    ref={toggleButtonRef}
                    variant="secondary"
                    className={showOverlay ? 'active' : ''}
                />
                <IconButton
                    icon={<Settings size={20} />}
                    onClick={() => setShowSettings(prev => !prev)}
                    title="Настройки"
                    variant="secondary"
                    ref={settingsButtonRef}
                />
                <IconButton
                    icon={<ArrowRight size={20} />}
                    onClick={handleRecalcAll}
                    title="Пересчитать"
                    variant="primary"
                />
            </div>

            {showOverlay && (
                <div ref={overlayRef}>
                    <OverlayKeyboard
                        onSelect={handleSymbolSelect}
                        onClose={() => setShowOverlay(false)}
                    />
                </div>
            )}
            {showSettings && (
                <div className="overlay-wrapper" ref={settingsRef}>
                    <SettingsOverlay
                        settings={{
                            ...settings,
                            lnBranches: lnBranches,
                        }}
                        onChange={handleSettingToggle}
                        onLnBranchesChange={handleLnBranchesChange}
                    />
                </div>
            )}
            {settings.overlayDisplay && (
                <FunctionOverlayBox functions={inputs} />
            )}
        </div>
    );
};

export default GraphInputComponent;
