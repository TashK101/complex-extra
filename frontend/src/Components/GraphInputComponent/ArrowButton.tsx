import React from 'react';
import { IconArrow } from '../../Icons/IconArrow';
import { IconDots } from '../../Icons/IconDots';

interface ButtonProps {
    backgroundColor: string; // Prop to set the background color
    onClick: () => void; // Prop to handle click events
    isDots: boolean;
}

const ArrowButton: React.FC<ButtonProps> = ({ backgroundColor, onClick, isDots }) => {
    return (
        <>
            {isDots ?
                <button
                    title='Введите функцию'
                    style={{
                        backgroundColor: "#d7d7d7",
                        padding: '3px 5px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'not-allowed',
                    }} >
                    <IconDots />
                </button>
                :
                <button
                    onClick={onClick}
                    title="Отобразить график для данной функции"
                    style={{
                        backgroundColor: backgroundColor,
                        padding: '3px 5px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    
                >
                    <IconArrow />
                </button>
            }
        </>
    );
};

export default ArrowButton;