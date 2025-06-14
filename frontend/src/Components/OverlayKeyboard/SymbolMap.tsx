type SymbolData = {
    display: string;
    value: string;
    tooltip: string;
    insert: string;
    cursorOffset: number;
};

const rawSymbolMap: Record<string, { display: string; value: string; tooltip: string }> = {
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
    'Ln': { display: 'Ln', value: 'Ln(z)', tooltip: 'Натуральный логарифм' },
    'abs': { display: '|x|', value: 'abs(z)', tooltip: 'Модуль' },
    'phi': { display: 'φ', value: 'phi', tooltip: 'Фи' },
    //'log': { display: 'log', value: 'log(z, 2)', tooltip: 'Логарифм' },
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

function computeInsert(value: string): { insert: string; cursorOffset: number } {
    const placeholder = 'z';
    const index = value.indexOf(placeholder);
    if (index === -1) {
        return { insert: value, cursorOffset: value.length };
    }

    const insert = value.replace(placeholder, '');
    return {
        insert,
        cursorOffset: index,
    };
}

export const SymbolMap: Record<string, SymbolData> = Object.fromEntries(
    Object.entries(rawSymbolMap).map(([key, { display, value, tooltip }]) => {
        const { insert, cursorOffset } = computeInsert(value);
        return [
            key,
            {
                display,
                value,
                tooltip,
                insert,
                cursorOffset,
            },
        ];
    })
);
