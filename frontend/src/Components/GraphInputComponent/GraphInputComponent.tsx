import { useState, useEffect } from 'react';
import { changeColor } from "../../store/action.ts";
import "./GraphInputComponent.css";
import ArrowButton from './ArrowButton';
import { useAppDispatch, useAppSelector } from '../../hooks/index.ts';

const buttonColors: string[] = [
    '#990000',
    '#997700',
    '#006600',
    '#000099',
    '#000000',
    '#ff2222',
    '#ff9922',
    '#22c555',
    '#2255ff',
    '#cccccc',
];

const GraphInputComponent = () => {
    const currentColor = useAppSelector(state => state.color);
    const dispatch = useAppDispatch();

    function handleChange(value: string): void {
        dispatch(changeColor(value));
    }

    const [inputs, setInputs] = useState<{ value: string, color: string }[]>([]);
    const [inputCount, setInputCount] = useState(1);

    const [colorIndex, setColorIndex] = useState(0);

    // Retrieve from localStorage when component mounts
    useEffect(() => {
        const inputItem = localStorage.getItem('graphInputs');
        const savedInputs = inputItem ?
            JSON.parse(inputItem)
            : [];

        const countItem = localStorage.getItem('inputCount');
        const savedCount = countItem ?
            parseInt(countItem)
            : 0;

        setInputs(savedInputs);
        setInputCount(savedCount);
    }, []);

    useEffect(() => {
        localStorage.setItem('graphInputs', JSON.stringify(inputs));
        localStorage.setItem('inputCount', inputCount.toString());
    }, [inputs, inputCount]);

    const addInput = () => {
        const randomColor = buttonColors[Math.floor(Math.random() * buttonColors.length)];
        const newInput = { value: 'z', color: randomColor };
        setInputs([...inputs, newInput]);
        setInputCount(inputCount + 1);
    };

    const removeInput = (index: number) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
        setInputCount(inputCount - 1);
    };

    const handleInputChange = (e: any, index: number) => {
        const newInputs = [...inputs];
        newInputs[index] = e.target.value;
        setInputs(newInputs);
    };

    const handleArrowClick = (index: number) => {
        console.log(`Drawing graph for input ${index}`);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '20px',
                borderRadius: '15px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white',
                width: '300px',
            }}
        >
            {inputs.map((input, index) => (
                <div className='input-cross-container'>
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            width: '100%',
                            alignItems: 'center',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '5px 10px',
                        }}
                    >
                        <input

                            type="text"
                            value={input.value}
                            onChange={(e) => handleInputChange(e, index)}
                            placeholder="Введите функцию"
                            style={{
                                flex: 1,
                                padding: '8px',
                                border: 'none',
                                borderRadius: '5px',
                                outline: 'none',
                            }}
                        />
                        <ArrowButton
                            onClick={() => handleArrowClick(index)}
                            backgroundColor={input.color}
                            isDots={input.value === ""}
                        />
                    </div>
                    <button
                        onClick={() => removeInput(index)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'grey',
                            cursor: 'pointer',
                            marginLeft: '5px',
                        }}
                    >
                        X
                    </button>
                </div>
            ))}
            <button onClick={addInput} style={{ padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                Добавить функцию
            </button>
        </div>
    );
};

export default GraphInputComponent;
