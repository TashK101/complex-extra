import {IconPencilSharp} from "../Icons/IconPencilSharp.tsx";
import {IconShapeLine} from "../Icons/IconShapeLine.tsx";
import {IconShapeOval1} from "../Icons/IconShapeOval1.tsx";
import {IconShapeRectangle} from "../Icons/IconShapeRectangle.tsx";
import {IconEraser} from "../Icons/IconEraser.tsx";
import {IconTrash} from "../Icons/IconTrash.tsx";

export function Panel(): React.JSX.Element {
    return (
        <>
            <div className={"control-panel"}>
                <div className={"panel-tool"} title={'Рисовать'}>
                    <IconPencilSharp/>
                </div>
                <div className={"panel-tool"} title={'Отрезок'}>
                    <IconShapeLine/>
                </div>
                <div className={"panel-tool"} title={'Эллипс'}>
                    <IconShapeOval1/>
                </div>
                <div className={"panel-tool"} title={'Прямоугольник'}>
                    <IconShapeRectangle/>
                </div>
                <div className={"panel-tool"} title={'Стереть'}>
                    <IconEraser/>
                </div>
                <div className={"panel-tool"} title={'Очистить'}>
                    <IconTrash/>
                </div>
                <div className={"panel-tool"} title={'Цвет'}>
                    <input type={'color'} className={'color-tool'}/>
                </div>
            </div>
            <div className={"control-placeholder"}/>
        </>
    );
}