import { MouseEvent, useState } from "react";
import "./overlayKeyboard.css";

type TabNames = 'operators' | 'functions' | 'constants' | 'parentheses' | 'separators';

type Props = {
    onSelect: (symbol: string) => void;
    onClose: () => void;
};

// Map for display symbols and their actual values when pressed

const symbolMap: Record<string, { display: string; value: string; tooltip: string }> = {
    '+': { display: '+', value: '+', tooltip: 'Плюс' },
    '-': { display: '-', value: '-', tooltip: 'Минус' },
    '*': { display: '×', value: '*', tooltip: 'Умножение' },
    '/': { display: '÷', value: '/', tooltip: 'Деление' },
    '^': { display: 'xª', value: '^', tooltip: 'Возведение в степень' },
    'real': { display: 'real', value: 'real(z)', tooltip: 'Действительная часть' },
    'im': { display: 'im', value: 'im(z)', tooltip: 'Мнимая часть' },
    'sin': { display: 'sin', value: 'sin(z)', tooltip: 'Синус' },
    'cos': { display: 'cos', value: 'cos(z)', tooltip: 'Косинус' },
    'tg': { display: 'tg', value: 'tg(z)', tooltip: 'Тангенс' },
    'asin': { display: 'asin', value: 'asin(z)', tooltip: 'Арксинус' },
    'acos': { display: 'acos', value: 'acos(z)', tooltip: 'Арккосинус' },
    'atg': { display: 'atg', value: 'atg(z)', tooltip: 'Арктангенс' },
    'ln': { display: 'ln', value: 'ln(z)', tooltip: 'Натуральный логарифм' },
    'abs': { display: '|x|', value: 'abs(z)', tooltip: 'Модуль' },
    'phi': { display: 'φ', value: 'phi', tooltip: 'Фи' },
    'log': { display: 'log', value: 'log(z, 2)', tooltip: 'Логарифм' },
    'root': { display: 'root', value: 'root(z, 2)', tooltip: 'Корень' },
    'sh': { display: 'sh', value: 'sh(z)', tooltip: 'Гиперболический синус' },
    'ch': { display: 'ch', value: 'ch(z)', tooltip: 'Гиперболический косинус' },
    'th': { display: 'th', value: 'th(z)', tooltip: 'Гиперболический тангенс' },
    'cth': { display: 'cth', value: 'cth(z)', tooltip: 'Гиперболический котангенс' },
    'sch': { display: 'sch', value: 'sch(z)', tooltip: 'Гиперболический секанс' },
    'csch': { display: 'csch', value: 'csch(z)', tooltip: 'Гиперболический косеканс' },
    'i': { display: 'i', value: 'i', tooltip: 'Мнимая единица' },
    'pi': { display: 'π', value: 'pi', tooltip: 'Пи' },
    'e': { display: 'exp', value: 'e', tooltip: 'Число Эйлера' },
    '(': { display: '(', value: '(', tooltip: 'Открывающая скобка' },
    ')': { display: ')', value: ')', tooltip: 'Закрывающая скобка' },
    ',': { display: ',', value: ',', tooltip: 'Запятая' },
};

export function OverlayKeyboard({ onSelect, onClose }: Props): React.JSX.Element {
    const [activeTab, setActiveTab] = useState<TabNames>('operators');

    // Mapping between the tab name and the symbols it contains
    const tabs: Record<TabNames, string[]> = {
        operators: ['+', '-', '*', '/', '^'],
        functions: ['real', 'im', 'sin', 'cos', 'tg', 'asin', 'acos', 'atg', 'ln', 'abs', 'phi', 'log', 'root', 'sh', 'ch', 'th', 'cth', 'sch', 'csch'],
        constants: ['i', 'pi', 'e'],
        parentheses: ['(', ')'],
        separators: [',']
    };

    function handleSymbolClick(evt: MouseEvent<HTMLButtonElement>) {
        const { value } = evt.currentTarget;
        onSelect(symbolMap[value].value); // Use the actual symbol value from the map
    }

    const renderSymbols = () => {
        return tabs[activeTab].map((symbol) => (
            <button
                key={symbol}
                value={symbol}
                onClick={handleSymbolClick}
                className={'function-button-overlay'}
                type="button" // Prevents form submission
                title={symbolMap[symbol].tooltip}
            >
                {symbolMap[symbol].display} {/* Display the mapped symbol */}
            </button>
        ));
    };

    return (
        <div className="overlay">
            <div className="tab-buttons">
                <button className={activeTab === 'operators' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('operators')}>Действия</button>
                <button className={activeTab === 'functions' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('functions')}>Функции</button>
                <button className={activeTab === 'constants' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('constants')}>Константы</button>
                <button className={activeTab === 'parentheses' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('parentheses')}>Скобки</button>
                <button className={activeTab === 'separators' ? 'active function-button' : 'function-button-inactive'} type="button" onClick={() => setActiveTab('separators')}>Разделители</button>
            </div>
            <div className="overlay-content">
                {renderSymbols()}
            </div>
            <button onClick={onClose} className="overlay-close-button" type="button">
                Скрыть
            </button>
        </div>
    );
}