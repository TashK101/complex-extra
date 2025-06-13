import { useEffect, useRef } from "react";
import { Tool, ViewRectangle } from "../../types/const.ts";
import './ZoomableGraphWrapper.css';

type Props = {
    viewRect: ViewRectangle,
    changeViewRect: (rect: ViewRectangle) => void,
    children: React.ReactNode,
    activeTool?: Tool, // optional, for tool checks
};

export function ZoomableGraphWrapper({ viewRect, changeViewRect, children, activeTool }: Props) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const lastMouseX = useRef(0);
    const lastMouseY = useRef(0);
    useEffect(() => {
        let initialDistance: number | null = null;

        const handleWheel = (e: WheelEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) return;
            e.preventDefault();

            const rect = wrapperRef.current.getBoundingClientRect();
            const zoomFactor = 1.1;
            const scale = e.deltaY < 0 ? 1 / zoomFactor : zoomFactor;

            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;

            const viewWidth = rect.width;
            const viewHeight = rect.height;

            const graphX = viewRect.left + (px / viewWidth) * (viewRect.right - viewRect.left);
            const graphY = viewRect.top - (py / viewHeight) * (viewRect.top - viewRect.bottom);

            const newWidth = (viewRect.right - viewRect.left) * scale;
            const newHeight = (viewRect.top - viewRect.bottom) * scale;

            changeViewRect({
                left: graphX - ((graphX - viewRect.left) / (viewRect.right - viewRect.left)) * newWidth,
                right: graphX + ((viewRect.right - graphX) / (viewRect.right - viewRect.left)) * newWidth,
                top: graphY + ((viewRect.top - graphY) / (viewRect.top - viewRect.bottom)) * newHeight,
                bottom: graphY - ((graphY - viewRect.bottom) / (viewRect.top - viewRect.bottom)) * newHeight,
            });
        };

        const handleMouseDown = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) return;
            if (e.button !== 0) return;
            if (activeTool && activeTool !== Tool.Pan) return;

            isDragging.current = true;
            lastMouseX.current = e.clientX;
            lastMouseY.current = e.clientY;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;

            const dx = e.clientX - lastMouseX.current;
            const dy = e.clientY - lastMouseY.current;
            lastMouseX.current = e.clientX;
            lastMouseY.current = e.clientY;

            const rect = wrapperRef.current!.getBoundingClientRect();
            const width = viewRect.right - viewRect.left;
            const height = viewRect.top - viewRect.bottom;

            const dxGraph = dx / rect.width * width;
            const dyGraph = dy / rect.height * height;

            changeViewRect({
                left: viewRect.left - dxGraph,
                right: viewRect.right - dxGraph,
                top: viewRect.top + dyGraph,
                bottom: viewRect.bottom + dyGraph,
            });
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        const handleMouseLeave = () => {
            isDragging.current = false;
        };
        
        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                initialDistance = Math.sqrt(dx * dx + dy * dy);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && initialDistance !== null) {
                e.preventDefault();

                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const newDistance = Math.sqrt(dx * dx + dy * dy);

                const scale = initialDistance / newDistance;
                const x = (viewRect.left + viewRect.right) / 2;
                const y = (viewRect.top + viewRect.bottom) / 2;
                const size = (viewRect.right - viewRect.left) * scale;

                changeViewRect({
                    left: x - size / 2,
                    right: x + size / 2,
                    top: y + size / 2,
                    bottom: y - size / 2,
                });
            }
        };

        const ref = wrapperRef.current;
        ref?.addEventListener("wheel", handleWheel, { passive: false });
        ref?.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        ref?.addEventListener("mouseleave", handleMouseLeave);
        ref?.addEventListener("touchstart", handleTouchStart, { passive: false });
        ref?.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            ref?.removeEventListener("wheel", handleWheel);
            ref?.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            ref?.removeEventListener("mouseleave", handleMouseLeave);
            ref?.removeEventListener("touchstart", handleTouchStart);
            ref?.removeEventListener("touchmove", handleTouchMove);
        };
    }, [viewRect, activeTool]);

    return <div className="graph-with-settings" ref={wrapperRef}>{children}</div>;
}
