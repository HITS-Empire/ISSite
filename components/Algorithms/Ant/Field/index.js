import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import FieldWrapper from "../../../FieldWrapper";
import { useRef, useState, useEffect } from "react";
import { getEmptyCell, getCellsWithFood } from "../Utils/field";

export default function Field({
    count,
    field,
    ants,
    colonyCell,
    setColonyCell,
    colonyEditorIsActive,
    setColonyEditorIsActive,
    setEmptyCell,
    foodCell,
    setFoodCell,
    cellsWithFood,
    setCellsWithFood,
    processIsActive,
    processIsPaused
}) {
    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Активная ячейка
    const [currentCell, setCurrentCell] = useState();

    // Активно ли окно редактирования ячейки еды
    const [foodWindowIsOpen, setFoodWindowIsOpen] = useState(false);

    // Размер текста для ячейки с едой
    const [foodTextSize, setFoodTextSize] = useState(0);
    const [foodTextSizeIsChanged, setFoodTextSizeIsChanged] = useState(false);

    // Событие клика на бокс
    const clickEvent = () => {
        if (colonyEditorIsActive) {
            if (colonyCell !== currentCell) {
                colonyCell.type = 0;
                currentCell.type = 2;

                colonyCell.draw();
                currentCell.draw();

                setColonyCell(currentCell);
                setEmptyCell(getEmptyCell(field))
            }

            return setColonyEditorIsActive(false);
        }

        if (foodCell) {
            if (foodCell !== currentCell) {
                currentCell.food = foodCell.food;
                foodCell.food = 0;

                setEmptyCell(getEmptyCell(field));
                setCellsWithFood(getCellsWithFood(field));
            }

            return setFoodCell();
        }

        if (currentCell.type === 2) {
            return setColonyEditorIsActive(true);
        }

        if (currentCell.food) {
            setFoodCell(currentCell);

            return setFoodWindowIsOpen(true);
        }

        currentCell.type = Number(!currentCell.type);
        currentCell.draw();

        setEmptyCell(getEmptyCell(field));
    };

    // Изменено количество еды в ячейке
    const changeFoodEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        foodCell.food = Math.min(Math.max(value, 0), 64);

        setEmptyCell(getEmptyCell(field));
        setCellsWithFood(getCellsWithFood(field));
    };

    // Закрыть редактор ячейки с едой
    const closeFoodWindow = () => {
        setFoodCell();
        setFoodWindowIsOpen(false);
    };

    // Нужно переместить ячейку с едой
    const moveFood = () => {
        setFoodWindowIsOpen(false);
    };

    // Отследить изменение размера для изменения размера текста для еды
    useEffect(() => {
        const resizeEvent = () => {
            setFoodTextSizeIsChanged(true);
        };

        window.addEventListener("resize", resizeEvent);

        return () => {
            window.removeEventListener("resize", resizeEvent);
        };
    }, []);

    // Установить начальный размер текста в ячейке с едой
    useEffect(() => {
        if (canvas) setFoodTextSizeIsChanged(true);
    }, [canvas, field]);

    // Отследить необходимость изменить размер текста в ячейке с едой
    useEffect(() => {
        if (!foodTextSizeIsChanged) return;

        const { width: size } = canvas.getBoundingClientRect();

        setFoodTextSize(size / count / 2.5);
        setFoodTextSizeIsChanged(false);
    }, [foodTextSizeIsChanged]);

    // Закрыть редакторы еды и колонии, когда процесс запустился
    useEffect(() => {
        if (!processIsActive) return;

        setColonyEditorIsActive(false);
        setFoodWindowIsOpen(false);
        setFoodCell();
    }, [processIsActive]);

    const extra = (
        colonyEditorIsActive && (
            currentCell.type === 0 || currentCell.type === 2
        ) && !currentCell.food && style.colony
    ) || (
        foodCell && !foodWindowIsOpen && currentCell.type === 0 && style.food
    ) || "";

    const disabled = processIsActive && !processIsPaused || (
        colonyEditorIsActive && (currentCell.type === 1 || currentCell.food)
    ) || (
        foodCell && (
            currentCell.type === 1 || currentCell.type === 2 || (
                currentCell.food && foodCell !== currentCell
            )
        )
    );

    // Отдельные элементы типа Box для отображения еды на поле
    const boxesWithFood = cellsWithFood.map((cell) => (
        <div
            className={`${style.background} ${style.food}`}
            style={{
                width: `calc(100% / ${count})`,
                height: `calc(100% / ${count})`,
                margin: (
                    `calc(100% * ${cell.column / count}) 0 0 calc(100% * ${cell.row / count})`
                ),
                fontSize: foodTextSize + "px"
            }}
        >
            {cell.food}
        </div>
    ));

    // Отдельные элементы типа Box для отображения муравьёв
    const boxesWithAnts = ants.map((ant, index) => (
        <div
            className={`${style.background} ${style.ant}`}
            style={{
                width: `calc(100% / ${count})`,
                height: `calc(100% / ${count})`,
                margin: ant.cell ? (
                    `calc(100% * ${ant.cell.column / count}) 0 0 calc(100% * ${ant.cell.row / count})`
                ) : 0,
                zIndex: index + 3,
                backgroundPosition: `${ant.leftIndent}% ${ant.topIndent}%`
            }}
        />
    ));

    // Меню для редактирования ячейки с едой
    const foodWindow = foodWindowIsOpen && (
        <div className={style.shadow}>
            <div className={style.window}>
                <div className={style.inputContainer}>
                    <Input
                        type="text"
                        label="Количество еды в ячейке"
                        description="Введите количество еды"
                        value={foodCell.food}
                        onChange={changeFoodEvent}
                    />
                </div>

                <div className={style.buttonContainer}>
                    <Button type="primary" onClick={closeFoodWindow}>
                        Готово
                    </Button>

                    <Button type="soft" onClick={moveFood}>
                        Переместить
                    </Button>
                </div>
            </div>
        </div>
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
            extraCells={boxesWithFood}
        >
            {...boxesWithFood}
            {...boxesWithAnts}
            {foodWindow}
        </FieldWrapper>
    );
}
