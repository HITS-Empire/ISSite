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

    // Дополнительные инструкции для метода cell.draw()
    const extraDraw = (cell, border, ceilBorder) => {
        if (cell.type !== 0) return;

        // Феромоны колонии
        ctx.fillStyle = `rgba(0, 0, 255, ${0.4 * cell.pheromone.colony.amount})`;
        ctx.fillRect(cell.x, cell.y, ceilBorder, ceilBorder);

        // Феромоны еды
        ctx.fillStyle = `rgba(255, 0, 0, ${0.4 * cell.pheromone.food.amount})`;
        ctx.fillRect(cell.x, cell.y, ceilBorder, ceilBorder);
    };

    // Изменить количество еды в ячейке
    const changeFood = (value) => {
        foodCell.food = value;

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
        if (!processIsActive || processIsPaused) return;

        setColonyEditorIsActive(false);
        setFoodWindowIsOpen(false);
        setFoodCell();
    }, [processIsActive, processIsPaused]);

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
    ) || currentCell && (
        !colonyEditorIsActive && !foodCell && !currentCell.food && currentCell.type !== 2
    ) && currentCell.ants;

    // Отдельные элементы типа Box для отображения еды на поле
    const boxesWithFood = cellsWithFood.map((cell, index) => (
        <div
            className={`${style.background} ${style.food}`}
            key={index}
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
            key={index}
            style={{
                width: `calc(100% / ${count})`,
                height: `calc(100% / ${count})`,
                margin: ant.cell ? (
                    `calc(100% * ${ant.cell.column / count}) 0 0 calc(100% * ${ant.cell.row / count})`
                ) : 0,
                zIndex: index + 3,
                backgroundPosition: `${ant.leftIndent}% ${ant.topIndent}%`,
                transition: processIsActive && "margin 0.1s"
            }}
        />
    ));

    // Меню для редактирования ячейки с едой
    const foodWindow = foodWindowIsOpen && foodCell && (
        <div className={style.shadow}>
            <div className={style.window}>
                <div className={style.inputContainer}>
                    <Input
                        label="Количество еды в ячейке"
                        description="Введите количество еды"
                        isNumber={true}
                        max={64}
                        value={foodCell.food}
                        setValue={changeFood}
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
            extraDraw={extraDraw}
            boxClassName={extra}
            clickEvent={clickEvent}
            currentCell={currentCell}
            setCurrentCell={setCurrentCell}
            boxDisabled={disabled}
            extraCells={boxesWithFood}
        >
            {boxesWithFood}
            {boxesWithAnts}
            {foodWindow}
        </FieldWrapper>
    );
}
