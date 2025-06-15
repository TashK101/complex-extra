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
    '^': { display: 'zª', value: '^', tooltip: 'Возведение в степень' },
    'real': { display: 'real', value: 'real(z)', tooltip: 'Действительная часть' },
    'im': { display: 'im', value: 'im(z)', tooltip: 'Мнимая часть' },
    'sin': { display: 'sin', value: 'sin(z)', tooltip: 'Синус' },
    'cos': { display: 'cos', value: 'cos(z)', tooltip: 'Косинус' },
    'tg': { display: 'tg', value: 'tg(z)', tooltip: 'Тангенс' },
    'ctg': { display: 'ctg', value: 'ctg(z)', tooltip: 'Котангенс' },
    'Asin': { display: 'Asin', value: 'Asin(z)', tooltip: 'Арксинус' },
    'Acos': { display: 'Acos', value: 'Acos(z)', tooltip: 'Арккосинус' },
    'Atg': { display: 'Atg', value: 'Atg(z)', tooltip: 'Арктангенс' },
    'Actg': { display: 'Actg', value: 'Actg(z)', tooltip: 'Арккотангенс' },
    'Arsh': { display: 'Arsh', value: 'Arsh(z)', tooltip: 'Гиперболический арксинус' },
    'Arch': { display: 'Arch', value: 'Arch(z)', tooltip: 'Гиперболический арккосинус' },
    'Arth': { display: 'Arth', value: 'Arth(z)', tooltip: 'Гиперболический арктангенс' },
    'Arcth': { display: 'Arcth', value: 'Arcth(z)', tooltip: 'Гиперболический арккотангенс' },
    'Ln': { display: 'Ln', value: 'Ln(z)', tooltip: 'Натуральный логарифм' },
    'abs': { display: '|z|', value: 'abs(z)', tooltip: 'Модуль' },
    //'phi': { display: 'φ', value: 'phi', tooltip: 'Фи' },
    //'log': { display: 'log', value: 'log(z, 2)', tooltip: 'Логарифм' },
    'Root': { display: 'Root', value: 'Root(z, 2)', tooltip: 'Корень' },
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
