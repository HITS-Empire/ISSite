import { useState, useEffect } from "react";
import EmptyField from "../components/EmptyField";
import Menu from "../components/Algorithms/Ant/Menu";
import Field from "../components/Algorithms/Ant/Field";

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

    return (
        <>
            <Menu />

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
