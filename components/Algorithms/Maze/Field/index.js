import style from "./style.module.scss";
import { useRef, useState } from "react";
import FieldWrapper from "../../../FieldWrapper";

export default function Field({
    count,
    field,
    startCell,
    setStartCell,
    endCell,
    setEndCell,
    startEditorIsActive,
    setStartEditorIsActive,
    endEditorIsActive,
    setEndEditorIsActive,
    processIsActive
}) {
    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Активная ячейка
    const [currentCell, setCurrentCell] = useState();

    // Событие клика на бокс
    const clickEvent = () => {
        if (startEditorIsActive) {
            if (startCell !== currentCell) {
                startCell.type = 0;
                currentCell.type = 2;

                startCell.draw();
                currentCell.draw();

                setStartCell(currentCell);
            }

            return setStartEditorIsActive(false);
        }
        if (endEditorIsActive) {
            if (endCell !== currentCell) {
                endCell.type = 0;
                currentCell.type = 3;

                endCell.draw();
                currentCell.draw();

                setEndCell(currentCell);
            }

            return setEndEditorIsActive(false);
        }

        if (currentCell.type === 2) {
            return setStartEditorIsActive(true);
        }
        if (currentCell.type === 3) {
            return setEndEditorIsActive(true);
        }

        currentCell.type = Number(!currentCell.type);
        currentCell.draw();
    };

    const extra = (
        startEditorIsActive && (currentCell.type === 0 || currentCell.type === 2) && style.start
    ) || (
        endEditorIsActive && (currentCell.type === 0 || currentCell.type === 3) && style.end
    ) || "";

    const disabled = processIsActive || (
        startEditorIsActive && (currentCell.type === 1 || currentCell.type === 3)
    ) || (
        endEditorIsActive && (currentCell.type === 1 || currentCell.type === 2)
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
            images={[
                "grass.png",
                "bedrock.png",
                "steve.png",
                "diamond.png",
                "water.png",
                "gold.png"
            ]}
            fieldClassName={style.field}
            boxClassName={extra}
            clickEvent={clickEvent}
            currentCell={currentCell}
            setCurrentCell={setCurrentCell}
            boxDisabled={disabled}
        />
    );
}
