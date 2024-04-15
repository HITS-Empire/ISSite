import { useState, useEffect } from "react";
import {
    getAnts,
    getField,
    runColony,
    getEmptyCell,
    getCellsWithFood,
} from "../components/Algorithms/Ant/Utils/field";
import EmptyField from "../components/EmptyField";
import Menu from "../components/Algorithms/Ant/Menu";
import Field from "../components/Algorithms/Ant/Field";

export default function Ant() {
    // Поле и его размеры
    const [count, setCount] = useState(0);
    const [field, setField] = useState([]);

    // Муравьи и их количество
    const [population, setPopulation] = useState(0);
    const [ants, setAnts] = useState([]);

    // Ячейка колонии
    const [colonyCell, setColonyCell] = useState();

    // Состояние редактирования колонии
    const [colonyEditorIsActive, setColonyEditorIsActive] = useState(false);

    // Первая попавшаяся пустая ячейка
    const [emptyCell, setEmptyCell] = useState();

    // Выбранная ячейка еды (для редактирования)
    const [foodCell, setFoodCell] = useState();

    // Все ячейки с едой (для отображения хитбоксов)
    const [cellsWithFood, setCellsWithFood] = useState([]);

    // Активен ли процесс имитации колонии (или он активен, но на паузе)
    const [processIsActive, setProcessIsActive] = useState(false);
    const [processIsPaused, setProcessIsPaused] = useState(false);

    // Перезагрузить поле и муравьёв
    const refreshField = () => {
        const { field, colonyCell } = getField(count);

        setField(field);
        setAnts(getAnts(field, colonyCell, population));
        setColonyCell(colonyCell);
        setColonyEditorIsActive(false);
        setEmptyCell(getEmptyCell(field));
        setFoodCell();
        setCellsWithFood(getCellsWithFood(field));
        setProcessIsActive(false);
        setProcessIsPaused(false);
    };

    // При заходе пользователя установить поле размером 16 x 16 и добавить 8 муравьёв
    useEffect(() => {
        setCount(16);
        setPopulation(8);
    }, []);

    // Получить новое поле при изменении размера
    useEffect(() => {
        refreshField();
    }, [count]);

    // Получить новый список муравьёв при изменении популяции
    useEffect(() => {
        if (processIsActive) return;

        setAnts(getAnts(field, colonyCell, population));
    }, [field, colonyCell, population]);

    // Управление колонией муравьёв
    useEffect(() => {
        if (!processIsActive || processIsPaused) return;

        const interval = setInterval(runColony, 20, {
            count,
            field,
            ants,
            setAnts
        });

        return () => {
            clearInterval(interval);
        };
    }, [processIsActive, processIsPaused]);

    return (
        <>
            <Menu
                count={count}
                setCount={setCount}
                field={field}
                population={population}
                setPopulation={setPopulation}
                emptyCell={emptyCell}
                setEmptyCell={setEmptyCell}
                cellsWithFood={cellsWithFood}
                setCellsWithFood={setCellsWithFood}
                processIsActive={processIsActive}
                setProcessIsActive={setProcessIsActive}
                processIsPaused={processIsPaused}
                setProcessIsPaused={setProcessIsPaused}
                refreshField={refreshField}
            />

            {count <= 1 ? (
                <EmptyField />
            ) : (
                <Field
                    count={count}
                    field={field}
                    ants={ants}
                    colonyCell={colonyCell}
                    setColonyCell={setColonyCell}
                    colonyEditorIsActive={colonyEditorIsActive}
                    setColonyEditorIsActive={setColonyEditorIsActive}
                    setEmptyCell={setEmptyCell}
                    foodCell={foodCell}
                    setFoodCell={setFoodCell}
                    cellsWithFood={cellsWithFood}
                    setCellsWithFood={setCellsWithFood}
                    processIsActive={processIsActive}
                    processIsPaused={processIsPaused}
                />
            )}
        </>
    );
}
