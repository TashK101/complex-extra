import React from 'react';
import './FunctionOverlayBox.css';

interface FunctionOverlayBoxProps {
    functions: { id: string; expression: string; color: string }[];
}

const FunctionOverlayBox: React.FC<FunctionOverlayBoxProps> = ({ functions }) => {
    if (!functions.length) return null;

    return (
        <div className="floating-expression-box">
            <h4>Отображаемые функции:</h4>
            {functions.map((fn, index) => (
                <div
                    key={fn.id}
                    className="floating-expression"
                    style={{ color: fn.color }}
                >
                    <span>
                        f<span style={{ fontSize: '0.75em', verticalAlign: 'bottom' }}>{index + 1}</span>(z) = {fn.expression}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default FunctionOverlayBox;
