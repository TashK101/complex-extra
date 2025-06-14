import React from 'react';
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
                    title={`Показываются ${settings.lnBranches} ветвей со стороны положительного и ${settings.lnBranches} со стороны отрицательного направления (по 2πi) относительно главного значения`}
                >
                    Показывать
                    <input
                        className="settings-number-input"
                        type="number"
                        min={1}
                        value={settings.lnBranches}
                        onChange={(e) => {
                            const raw = e.target.value;

                            if (raw === '') {
                                onLnBranchesChange(NaN);
                                return;
                            }

                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val > 0) {
                                onLnBranchesChange(val);
                            }
                        }}
                    />
                    значений для Ln(z)
                </label>
            </div>
        </div>
    );
};

export default SettingsOverlay;
