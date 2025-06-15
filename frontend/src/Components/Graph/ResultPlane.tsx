import {useBoxRect} from "../../hooks/useBoxRect.ts";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {DrawLine} from "./Drawing/DrawLine.ts";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {resizeResult} from "../../store/action.ts";
import { Tool } from "../../types/const.ts";


export function ResultPlane(): React.JSX.Element {
    const boxRef = useRef<HTMLDivElement>(null);
    const {height, width} = useBoxRect(boxRef);
    const result = useAppSelector(state => state.result);
    const tool = useAppSelector(state => state.tool);
    const viewRect = useAppSelector(state => state.resultView);
    const connectTransformedDots = useAppSelector(state => state.connectTransformedDots);
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

    return (
        <div className={'graph-show graph-window'} ref={boxRef} style={{
                        cursor: tool === Tool.Pan ? 'grab' : 'crosshair',
                    }}>
            <svg style={{height: '100%', width: '100%'}}>
            
                {result.map(line => (
                    <DrawLine
                        key={line.id}
                        line={line}
                        viewRect={viewRect}
                        box={{width, height}}
                        forceDots={!connectTransformedDots}
                    />
                ))}
            </svg>
        </div>
    );
}
