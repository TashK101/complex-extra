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
        // в функциях нет log и phi, но они парсятся - обсудили с руководителем, оставляем только Ln, чтобы не путать пользователей
        functions: ['real', 'im', 'sin', 'cos', 'tg', 'ctg', 'Asin', 'Acos', 'Atg', 'Actg', 'Ln', 'abs', 'Root', 'sh', 'ch', 'th', 'cth', 'sch', 'csch', 'Arsh', 'Arch', 'Arth', 'Arcth'],
        constants: ['i', 'pi', 'e'],
        parentheses: ['(', ')', ',']
    };

    const functionGroups = [
        {
            label: null,
            symbols: ['real', 'im', 'abs', 'Root', 'Ln']
        },
        {
            label: 'Тригонометрические и обратные к ним',
            symbols: ['sin', 'cos', 'tg', 'ctg', 'Asin', 'Acos', 'Atg', 'Actg']
        },
        {
            label: 'Гиперболические и обратные к ним',
            symbols: ['sh', 'ch', 'th', 'cth', 'sch', 'csch', 'Arsh', 'Arch', 'Arth', 'Arcth']
        }
    ];


    function handleSymbolClick(evt: MouseEvent<HTMLButtonElement>) {
        const { value } = evt.currentTarget;
        onSelect(value);
    }

    const renderSymbols = () => {
        if (activeTab === 'functions') {
            return functionGroups.flatMap((group, index) => {
                const elements = [];

                if (group.label) {
                    elements.push(
                        <div key={`separator-${index}`} className="function-separator">
                            <span>{group.label}</span>
                        </div>
                    );
                }

                elements.push(
                    ...group.symbols.map((symbol) => (
                        <button
                            key={symbol}
                            value={symbol}
                            onClick={handleSymbolClick}
                            className="function-button-overlay"
                            type="button"
                            title={SymbolMap[symbol].tooltip}
                        >
                            {SymbolMap[symbol].display}
                        </button>
                    ))
                );

                return elements;
            });
        }

        return tabs[activeTab].map((symbol) => (
            <button
                key={symbol}
                value={symbol}
                onClick={handleSymbolClick}
                className="function-button-overlay"
                type="button"
                title={SymbolMap[symbol].tooltip}
            >
                {SymbolMap[symbol].display}
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
