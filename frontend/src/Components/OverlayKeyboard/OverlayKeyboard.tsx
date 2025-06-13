import { MouseEvent, useState } from "react";
import { SymbolMap } from "./SymbolMap";
import "./OverlayKeyboard.css";

type TabNames = 'operators' | 'functions' | 'constants' | 'parentheses';

type Props = {
    onSelect: (symbol: string) => void;
    onClose: () => void;
};

export function OverlayKeyboard({ onSelect, onClose }: Props): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<TabNames>('operators');

    const tabs: Record<TabNames, string[]> = {
        operators: ['+', '-', '*', '/', '^'],
        functions: ['real', 'im', 'sin', 'cos', 'tg', 'asin', 'acos', 'atg', 'ln', 'abs', 'phi', 'log', 'root', 'sh', 'ch', 'th', 'cth', 'sch', 'csch'],
        constants: ['i', 'pi', 'e'],
        parentheses: ['(', ')', ',']
    };

    function handleSymbolClick(evt: MouseEvent<HTMLButtonElement>) {
        const { value } = evt.currentTarget;
        onSelect(value); 
    }

    const renderSymbols = () => {
        return tabs[activeTab].map((symbol) => (
            <button
                key={symbol}
                value={symbol}
                onClick={handleSymbolClick}
                className={'function-button-overlay'}
                type="button" 
                title={SymbolMap[symbol].tooltip}
            >
                {SymbolMap[symbol].display} {}
            </button>
        ));
    };

    return (
        <div className="overlay-wrapper">
            <div className="overlay">
                <div className="tab-buttons">
                    <button className={activeTab === 'operators' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('operators')}>Операторы</button>
                    <button className={activeTab === 'functions' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('functions')}>Функции</button>
                    <button className={activeTab === 'constants' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('constants')}>Константы</button>
                    <button className={activeTab === 'parentheses' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('parentheses')}>Скобки и разделители</button>
                </div>
                <div className="overlay-content">
                    {renderSymbols()}
                </div>
            </div>
        </div>
    );
}
