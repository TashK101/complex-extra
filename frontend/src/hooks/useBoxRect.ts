import {RefObject, useEffect, useState} from "react";

export const useBoxRect = (boxRef: RefObject<HTMLElement>): {
    height: number,
    width: number,
    boxX: number,
    boxY: number
} => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [boxX, setBoxX] = useState(0);
    const [boxY, setBoxY] = useState(0);
    //const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        function updateRect() {
            if (boxRef && boxRef.current) {
                const rect = boxRef.current.getBoundingClientRect();
                setHeight(rect.height);
                setWidth(rect.width);
                setBoxX(rect.x);
                setBoxY(rect.y);
            }
        }
        updateRect();
        window.addEventListener('resize', updateRect);
        return () => {
            window.removeEventListener('resize', updateRect);
        };
    }, [boxRef]);
    return {height, width, boxX, boxY};
}