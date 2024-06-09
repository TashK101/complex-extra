import './tools.css'
import {IconPencilSharp} from "../../Icons/IconPencilSharp.tsx";
import {IconShapeLine} from "../../Icons/IconShapeLine.tsx";
import {IconShapeOval1} from "../../Icons/IconShapeOval1.tsx";
import {IconShapeRectangle} from "../../Icons/IconShapeRectangle.tsx";
import {IconEraser} from "../../Icons/IconEraser.tsx";
import {ToolButton} from "./ToolButton.tsx";
import {Tool} from "../../types/const.ts";
import {ColorButton} from "./ColorButton.tsx";
import {DeleteButton} from "./DeleteButton.tsx";

export function Panel(): React.JSX.Element {
    return (
        <>
            <div className={"control-panel"}>
                <ToolButton tool={Tool.Pencil} description={'Рисовать'}>
                    <IconPencilSharp/>
                </ToolButton>
                <ToolButton tool={Tool.Line} description={'Отрезок'}>
                    <IconShapeLine/>
                </ToolButton>
                <ToolButton tool={Tool.Ellipse} description={'Эллипс'}>
                    <IconShapeOval1/>
                </ToolButton>
                <ToolButton tool={Tool.Rectangle} description={'Прямоугольник'}>
                    <IconShapeRectangle/>
                </ToolButton>
                <ToolButton tool={Tool.Eraser} description={'Стереть'}>
                    <IconEraser/>
                </ToolButton>
                <DeleteButton/>
                <ColorButton/>
            </div>
            <div className={"control-placeholder"}/>
        </>
    );
}