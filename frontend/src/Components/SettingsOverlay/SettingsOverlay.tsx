import React from 'react';
import Select from 'react-select';
import '../OverlayKeyboard/OverlayKeyboard.css'
import './SettingsOverlay.css';

interface SettingsOverlayProps {
    settings: {
        polar: boolean;
        radians: boolean;
        overlayDisplay: boolean;
        lnBranches: number;
    };
    onChange: (key: 'polar' | 'radians' | 'overlayDisplay') => void;
    onLnBranchesChange: (value: number) => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ settings, onChange, onLnBranchesChange }) => {
    const lnBranchOptions = [
        { value: 0, label: 'Только главную ветвь' },
        ...Array.from({ length: 49 }, (_, i) => {
            const n = i + 1;
            return {
                value: n,
                label: getBranchLabel(n)
            };
        })
    ];

    function getBranchLabel(n: number): string {
        const count = n * 2 + 1;

        const lastDigit = count % 10;
        const lastTwo = count % 100;

        if (lastDigit === 1 && lastTwo !== 11) return `${count} ветвь`;
        if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwo)) return `${count} ветви`;
        return `${count} ветвей`;
    }

    return (
        <div className="overlay">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={settings.polar}
                        onChange={() => onChange('polar')}
                    />
                    Полярные координаты
                </label>

                <label title={settings.polar ? '' : 'Перейдите в полярные координаты'}>
                    <input
                        type="checkbox"
                        checked={settings.radians}
                        onChange={() => onChange('radians')}
                        disabled={!settings.polar}
                    />
                    Радианная мера
                </label>

                <label title="Включите, чтобы отображать функции в углу — удобно для скриншотов или записи видео">
                    <input
                        type="checkbox"
                        checked={settings.overlayDisplay}
                        onChange={() => onChange('overlayDisplay')}
                    />
                    Введенные функции в углу экрана
                </label>

                <label
                    className="settings-number-label"
                >
                    Для многозначных функций показывать:
                    <div style={{ width: '80%' }}>
                        <Select
                            options={lnBranchOptions}
                            value={lnBranchOptions.find(opt => opt.value === settings.lnBranches)}
                            onChange={(selected) => {
                                if (selected) onLnBranchesChange(selected.value);
                            }}
                            className="settings-select"
                            classNamePrefix="select"
                            isSearchable
                            menuPlacement="auto"
                            maxMenuHeight={160}
                        />
                    </div>
                </label>
            </div>
        </div>
    );
};

export default SettingsOverlay;
