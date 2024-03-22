import { useState, useEffect } from "react";
import EmptyField from "../components/EmptyField";
import Menu from "../components/Algorithms/Ant/Menu";
import Field from "../components/Algorithms/Ant/Field";
import { getField } from "../components/Algorithms/Ant/Utils/field";

export default function Ant() {
    // Поле и его размеры
    const [count, setCount] = useState(0);
    const [field, setField] = useState([]);

    // Ячейка колонии
    const [colonyCell, setColonyCell] = useState();

    // Состояние редактирования колонии
    const [colonyEditorIsActive, setColonyEditorIsActive] = useState(false);

    // Выбранная ячейка еды (для редактирования)
    const [currentFoodCell, setCurrentFoodCell] = useState();

    // Активен ли процесс имитации колонии
    const [processIsActive, setProcessIsActive] = useState(false);

    // Перезагрузить поле
    const refreshField = () => {
        const { field, colonyCell } = getField(count);

        setField(field);
        setColonyCell(colonyCell);
        setProcessIsActive(false);
    };

    // При заходе пользователя установить поле размером 32 x 32
    useEffect(() => {
        setCount(32);
    }, []);

    // Получить новое поле при изменении размера
    useEffect(() => {
        refreshField();
    }, [count]);

    // Распечатать поле в консоль после изменения
    useEffect(() => {
        console.log(field);
    }, [field]);

    return (
        <>
            <Menu
                count={count}
                setCount={setCount}
                processIsActive={processIsActive}
                setProcessIsActive={setProcessIsActive}
                refreshField={refreshField}
            />

            {count <= 1 ? (
                <EmptyField />
            ) : (
                <Field
                    count={count}
                    field={field}
                    colonyCell={colonyCell}
                    setColonyCell={setColonyCell}
                    colonyEditorIsActive={colonyEditorIsActive}
                    setColonyEditorIsActive={setColonyEditorIsActive}
                    currentFoodCell={currentFoodCell}
                    setCurrentFoodCell={setCurrentFoodCell}
                    processIsActive={processIsActive}
                />
            )}
        </>
    );
}
