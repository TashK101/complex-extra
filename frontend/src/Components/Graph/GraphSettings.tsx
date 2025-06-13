import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { ViewRectangle } from "../../types/const.ts";
import './GraphSettings.css';

type Props = PropsWithChildren<{
    viewRect: ViewRectangle,
    changeViewRect: (rect: ViewRectangle) => void,
}>

export function GraphSettings({ viewRect, changeViewRect, children }: Props): React.JSX.Element {
    const graphContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let initialDistance: number | null = null;

        const handleWheel = (e: WheelEvent) => {
            if (!graphContainerRef.current?.contains(e.target as Node)) return;

            e.preventDefault(); // prevent page scroll only when inside graph
            const zoomFactor = 1.1;
            const scale = e.deltaY < 0 ? 1 / zoomFactor : zoomFactor;

            const x = (viewRect.left + viewRect.right) / 2;
            const y = (viewRect.top + viewRect.bottom) / 2;
            const size = (viewRect.right - viewRect.left) * scale;

            changeViewRect({
                left: x - size / 2,
                right: x + size / 2,
                top: y + size / 2,
                bottom: y - size / 2,
            });
        };

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 2 && graphContainerRef.current?.contains(e.target as Node)) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                initialDistance = Math.sqrt(dx * dx + dy * dy);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 2 && initialDistance !== null && graphContainerRef.current?.contains(e.target as Node)) {
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

        const container = graphContainerRef.current;
        container?.addEventListener('wheel', handleWheel, { passive: false });
        container?.addEventListener('touchstart', handleTouchStart, { passive: false });
        container?.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            container?.removeEventListener('wheel', handleWheel);
            container?.removeEventListener('touchstart', handleTouchStart);
            container?.removeEventListener('touchmove', handleTouchMove);
        };
    }, [viewRect]);

    const [values, setValues] = useState<{ x: string, y: string, size: string }>({
        x: `${(viewRect.left + viewRect.right) / 2}`,
        y: `${(viewRect.top + viewRect.bottom) / 2}`,
        size: `${viewRect.right - viewRect.left}`,
    });
    const [errors, setErrors] = useState<{ x: boolean, y: boolean, size: boolean }>({ x: false, y: false, size: false });

    const handleChangeViewRect = () => {
        const [x, y, size] = [Number(values.x), Number(values.y), Number(values.size)];
        if (!checkValues(x, y, size)) return;
        changeViewRect({
            top: y + size / 2,
            right: x + size / 2,
            bottom: y - size / 2,
            left: x - size / 2,
        });
    };

    const checkValues = (x: number, y: number, size: number): boolean => {
        let result = true;
        const newErrors = {
            x: isNaN(x),
            y: isNaN(y),
            size: isNaN(size) || size <= 100 * Number.EPSILON
        };
        setErrors(newErrors);
        result = !newErrors.x && !newErrors.y && !newErrors.size;
        return result;
    };

    const handleValueChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const name = evt.target.name;
        setValues({ ...values, [name]: evt.target.value });
    };

    return (
        <div className={'settings-container'} ref={graphContainerRef}>
            <form className={'graph-settings-form'}>
                <label className={'settings-label'}>
                    X:
                    <input
                        className={errors.x ? 'settings-input settings-input-error' : 'settings-input'}
                        maxLength={13} name={'x'} value={values.x}
                        onChange={handleValueChange}
                        onBlur={handleChangeViewRect}
                    />
                </label>
                <label className={'settings-label'}>
                    Y:
                    <input
                        className={errors.y ? 'settings-input settings-input-error' : 'settings-input'}
                        maxLength={13} name={'y'} value={values.y}
                        onChange={handleValueChange}
                        onBlur={handleChangeViewRect}
                    />
                </label>
                <label className={'settings-label'}>
                    Размер:
                    <input
                        className={errors.size ? 'settings-input settings-input-error' : 'settings-input'}
                        maxLength={13} name={'size'} value={values.size}
                        onChange={handleValueChange}
                        onBlur={handleChangeViewRect}
                    />
                </label>
            </form>
            {children}
        </div>
    );
}
