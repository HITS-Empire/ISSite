import { useEffect, useState } from "react";
import Menu from "../components/Algorithms/Maze/Menu";
import Field from "../components/Algorithms/Maze/Field";
import { getField } from "../components/Algorithms/Maze/Utils/field";

export default function Maze() {
    // Поле и его размеры
    const [count, setCount] = useState(0);
    const [field, setField] = useState([]);

    // Стартовая и конечная ячейка
    const [startCell, setStartCell] = useState();
    const [endCell, setEndCell] = useState();

    // Состояния редактирования
    const [startEditorIsActive, setStartEditorIsActive] = useState(false);
    const [endEditorIsActive, setEndEditorIsActive] = useState(false);

    // Перезагрузить поле
    const refreshField = () => {
        const { field, startCell, endCell } = getField(count);

        setField(field);
        setStartCell(startCell);
        setEndCell(endCell);
    };

    // При заходе пользователя установить поле размером 10 x 10
    useEffect(() => {
        setCount(10);
    }, [])

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
                refreshField={refreshField}
            />

            <Field
                count={count}
                field={field}
                setField={setField}
                startCell={startCell}
                setStartCell={setStartCell}
                endCell={endCell}
                setEndCell={setEndCell}
                startEditorIsActive={startEditorIsActive}
                setStartEditorIsActive={setStartEditorIsActive}
                endEditorIsActive={endEditorIsActive}
                setEndEditorIsActive={setEndEditorIsActive}
            />
        </>
    );
}
