import {RefObject, useEffect, useState} from "react";

export const useMousePosition = (includeTouch: boolean) => {
    const [mousePosition, setMousePosition] =
        useState<{x: number | null, y: number | null}>({x: null, y: null});
    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent|TouchEvent) => {
            let x, y;
            if (window.TouchEvent && ev instanceof TouchEvent) {
                const touch = ev.touches[0];
                [x, y] = [touch.clientX, touch.clientY];
            } else if (ev instanceof MouseEvent) {
                [x, y] = [ev.clientX, ev.clientY];
            } else {
                [x, y] = [null, null]
            }
            setMousePosition({ x, y });
        };
        window.addEventListener('mousemove', updateMousePosition);
        if (includeTouch) {
            window.addEventListener('touchmove', updateMousePosition);
        }
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            if (includeTouch) {
                window.removeEventListener('touchmove', updateMousePosition);
            }
        };
    }, [includeTouch]);
    return mousePosition;
};

export const useBoxRect = (boxRef: RefObject<HTMLElement>): {height: number, width: number, boxX: number, boxY: number} => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [boxX, setBoxX] = useState(0);
    const [boxY, setBoxY] = useState(0);
    //const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (boxRef && boxRef.current) {
            const rect = boxRef.current.getBoundingClientRect();
            setHeight(rect.height);
            setWidth(rect.width);
            setBoxX(rect.x);
            setBoxY(rect.y);
        }
    }, [boxRef]);
    return {height, width, boxX, boxY};
}