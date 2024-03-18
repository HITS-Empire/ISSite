import { useEffect, useState } from "react";
import Menu from "../components/Algorithms/Maze/Menu";
import Field from "../components/Algorithms/Maze/Field";
import { getField } from "../components/Algorithms/Maze/Utils/field";

export default function Maze() {
    // Поле и его размеры
    const [count, setCount] = useState(0);
    const [field, setField] = useState([]);

    // Состояния редактирования
    const [borderEditorIsActive, setBorderEditorIsActive] = useState(false);
    const [startEditorIsActive, setStartEditorIsActive] = useState(false);
    const [endEditorIsActive, setEndEditorIsActive] = useState(false);

    // При заходе пользователя установить поле размером 10 x 10
    useEffect(() => {
        setCount(10);
    }, [])

    // Получить новое поле при изменении размера
    useEffect(() => {
        setField(getField(count));
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
                borderEditorIsActive={borderEditorIsActive}
                setBorderEditorIsActive={setBorderEditorIsActive}
                startEditorIsActive={startEditorIsActive}
                setStartEditorIsActive={setStartEditorIsActive}
                endEditorIsActive={endEditorIsActive}
                setEndEditorIsActive={setEndEditorIsActive}
            />

            <Field
                count={count}
                field={field}
                setField={setField}
                borderEditorIsActive={borderEditorIsActive}
                startEditorIsActive={startEditorIsActive}
                endEditorIsActive={endEditorIsActive}
            />
        </>
    );
}
