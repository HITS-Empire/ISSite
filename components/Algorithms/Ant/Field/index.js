import style from "./style.module.scss";
import FieldWrapper from "../../../FieldWrapper";
import { useRef, useState } from "react";

export default function Field({
    count,
    field,
    colonyCell,
    setColonyCell,
    colonyEditorIsActive,
    setColonyEditorIsActive,
    currentFoodCell,
    setCurrentFoodCell,
    processIsActive,
    processIsPaused
}) {
    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Активная ячейка
    const [currentCell, setCurrentCell] = useState();

    // Событие клика на бокс
    const clickEvent = () => {
        if (colonyEditorIsActive) {
            if (colonyCell !== currentCell) {
                colonyCell.type = 0;
                currentCell.type = 2;

                colonyCell.draw();
                currentCell.draw();

                setColonyCell(currentCell);
            }

            return setColonyEditorIsActive(false);
        }

        if (currentCell.type === 2) {
            return setColonyEditorIsActive(true);
        }

        currentCell.type = Number(!currentCell.type);
        currentCell.draw();
    };

    const extra = (
        colonyEditorIsActive && (currentCell.type === 0 || currentCell.type === 2) && style.colony
    ) || (
        currentFoodCell && (currentCell.type === 0 || currentCell.food) && style.food
    ) || "";

    const disabled = processIsActive || (
        colonyEditorIsActive && (currentCell.type === 1 || currentCell.food)
    ) || (
        currentFoodCell && (currentCell.type === 1 || currentCell.type === 2)
    );

    return (
        <FieldWrapper
            count={count}
            field={field}
            canvasRef={canvasRef}
            canvas={canvas}
            setCanvas={setCanvas}
            ctx={ctx}
            setCtx={setCtx}
            images={["grass.png", "bedrock.png", "spawner.png"]}
            boxClassName={extra}
            clickEvent={clickEvent}
            currentCell={currentCell}
            setCurrentCell={setCurrentCell}
            boxDisabled={disabled}
        /> 
    );
}
