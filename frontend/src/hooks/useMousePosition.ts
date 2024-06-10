import {useEffect, useState} from "react";

export const useMousePosition = (includeTouch: boolean) => {
    const [mousePosition, setMousePosition] =
        useState<{ mouseX: number | null, mouseY: number | null }>({mouseX: null, mouseY: null});
    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent | TouchEvent) => {
            let x, y;
            if (window.TouchEvent && ev instanceof TouchEvent) {
                if (!ev.touches || ev.touches.length !== 1) {
                    [x, y] = [null, null];
                } else {
                    const touch = ev.touches[0] ?? {pageX: null, pageY: null};
                    [x, y] = [touch.clientX, touch.clientY];
                }
            } else if (ev instanceof MouseEvent) {
                [x, y] = [ev.pageX, ev.pageY];
            } else {
                [x, y] = [null, null]
            }
            setMousePosition({mouseX: x, mouseY: y});
        };
        window.addEventListener('mousemove', updateMousePosition);
        if (includeTouch) {
            window.addEventListener('touchmove', updateMousePosition);
            window.addEventListener('touchend', updateMousePosition);
        }
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            if (includeTouch) {
                window.removeEventListener('touchmove', updateMousePosition);
                window.removeEventListener('touchend', updateMousePosition);
            }
        };
    }, [includeTouch]);
    return mousePosition;
};