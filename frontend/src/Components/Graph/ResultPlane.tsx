import {useBoxRect} from "../../hooks/useBoxRect.ts";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {DrawLine} from "./Drawing/DrawLine.ts";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {resizeResult} from "../../store/action.ts";

interface ResultPlaneProps {
    usePolar: boolean;
} 

export function ResultPlane({usePolar}: ResultPlaneProps): React.JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {height, width} = useBoxRect(boxRef);
    const result = useAppSelector(state => state.result);
    const viewRect = useAppSelector(state => state.resultView);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (result.length > 0 && (result.length > 1 || result[0].values.length > 1)) {
            const bounds = {top: -Infinity, left: Infinity, bottom: Infinity, right: -Infinity};

            for (let line of result) {
                bounds.right = Math.max(...line.values.map(p => p[0]), bounds.right);
                bounds.left = Math.min(...line.values.map(p => p[0]), bounds.left);
                bounds.top = Math.max(...line.values.map(p => p[1]), bounds.top);
                bounds.bottom = Math.min(...line.values.map(p => p[1]), bounds.bottom);
            }

            const offset = Math.max(bounds.top - bounds.bottom, bounds.right - bounds.left) * 0.55;
            const newRect = {
                top: (bounds.top + bounds.bottom) / 2 + offset,
                bottom: (bounds.top + bounds.bottom) / 2 - offset,
                left: (bounds.left + bounds.right) / 2 - offset,
                right: (bounds.left + bounds.right) / 2 + offset,
            };

            if (offset > 0 && (offset < (viewRect.top - viewRect.bottom) / 20
                || newRect.top > viewRect.top
                || newRect.bottom < viewRect.bottom
                || newRect.right > viewRect.right
                || newRect.left < viewRect.left)) {
                dispatch(resizeResult(newRect));
            }
        }

    }, [result]);

    const polarGrid = useMemo(() => {
        if (!usePolar || !width || !height) return null;
        const centerX = width / 2;
        const centerY = height / 2;
        const numCircles = 5; // Number of concentric circles
        const numRadialLines = 12; // Number of radial lines
        const maxRadius = Math.min(width, height) / 2; // Max radius for circles

        // Generate concentric circles
        const circles = Array.from({ length: numCircles }, (_, i) => {
            const radius = ((i + 1) / numCircles) * maxRadius;
            return <circle key={`circle-${i}`} cx={centerX} cy={centerY} r={radius} stroke="gray" fill="none" />;
        });

        // Generate radial lines
        const radialLines = Array.from({ length: numRadialLines }, (_, i) => {
            const angle = (i / numRadialLines) * 2 * Math.PI;
            const x = centerX + maxRadius * Math.cos(angle);
            const y = centerY + maxRadius * Math.sin(angle);
            return <line key={`radial-${i}`} x1={centerX} y1={centerY} x2={x} y2={y} stroke="gray" />;
        });

        return [...circles, ...radialLines];
    }, [usePolar, width, height]);

    

    return (
        <div className={'graph-show graph-window'} ref={boxRef}>
            <svg style={{height: '100%', width: '100%'}}>
            
                {result.map(line => (
                    <DrawLine
                        key={line.id}
                        line={line}
                        viewRect={viewRect}
                        box={{width, height}}
                    />
                ))}
            </svg>
        </div>
    );
}
