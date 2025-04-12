import {PropsWithChildren, useEffect, useState, useRef} from "react";
import {ViewRectangle} from "../../types/const.ts";



type Props = PropsWithChildren<{
    viewRect: ViewRectangle,
    changeViewRect: (rect: ViewRectangle) => {},
}>

export function GraphSettings({viewRect, changeViewRect, children}: Props): React.JSX.Element {
    const graphContainerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
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
    
        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [viewRect]);

    useEffect(() => {
        const centerX = (viewRect.left + viewRect.right) / 2;
        const centerY = (viewRect.top + viewRect.bottom) / 2;
        const size = viewRect.right - viewRect.left;
    
        setValues({
            x: centerX.toString(),
            y: centerY.toString(),
            size: size.toString(),
        });
    }, [viewRect]);
    
    const [values, setValues] = useState<{ x: string, y: string, size: string }>({
        x: `${viewRect.right / 2 + viewRect.left / 2}`,
        y: `${viewRect.top / 2 + viewRect.bottom / 2}`,
        size: `${viewRect.right - viewRect.left}`,
    });
    const [errors, setErrors] = useState<{ x: boolean, y: boolean, size: boolean }>({x: false, y: false, size: false});

    const handleChangeViewRect = () => {
        const [x, y, size] = [Number(values.x), Number(values.y), Number(values.size)];
        if (!checkValues(x, y, size)) {
            return;
        }
        changeViewRect({
            top: y + size / 2,
            right: x + size / 2,
            bottom: y - size / 2,
            left: x - size / 2,
        });
    }

    const checkValues = (x: number, y: number, size: number): boolean => {
        let result = true;
        if (isNaN(x)) {
            setErrors({...errors, x: true});
            result = false;
        } else {
            setErrors({...errors, x: false});
        }
        if (isNaN(y)) {
            setErrors({...errors, y: true});
            result = false;
        } else {
            setErrors({...errors, y: false});
        }
        if (isNaN(size) || size <= 100 * Number.EPSILON) {
            setErrors({...errors, size: true});
            result = false;
        } else {
            setErrors({...errors, size: false});
        }
        return result;
    }

    const handleValueChange = (evt: React.FocusEvent<HTMLInputElement>) => {
        const name = evt.target.name;
        setValues({...values, [name]: evt.target.value});
        handleChangeViewRect();
    }

    return (
        <div className={'settings-container'}>
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