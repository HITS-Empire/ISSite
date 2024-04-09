import { useEffect, useState } from "react";
import EmptyField from "../components/EmptyField";
import {
    getField,
    findPathInField
} from "../components/Algorithms/Maze/Utils/field";
import Menu from "../components/Algorithms/Maze/Menu";
import Field from "../components/Algorithms/Maze/Field";

export default function Maze() {
    // Поле и его размеры
    const [count, setCount] = useState(0);
    const [field, setField] = useState([]);

    // Скорость отрисовки
    const [renderingDelay, setRenderingDelay] = useState(16);

    // Стартовая и конечная ячейка
    const [startCell, setStartCell] = useState();
    const [endCell, setEndCell] = useState();

    // Состояния редактирования
    const [startEditorIsActive, setStartEditorIsActive] = useState(false);
    const [endEditorIsActive, setEndEditorIsActive] = useState(false);

    // Активен ли процесс поиска пути
    const [processIsActive, setProcessIsActive] = useState(false);

    // Статус поиска (0 - нет статуса, 1 - успех, 2 - ошибка)
    const [status, setStatus] = useState(0);

    // Перезагрузить поле
    const refreshField = () => {
        const { field, startCell, endCell } = getField(count);

        setField(field);
        setStartCell(startCell);
        setEndCell(endCell);
        setProcessIsActive(false);
        setStatus();
    };

    // При заходе пользователя установить поле размером 16 x 16
    useEffect(() => {
        setCount(16);
        setStatus();
    }, []);

    // Получить новое поле при изменении размера
    useEffect(() => {
        refreshField();
    }, [count]);

    // Начать процесс поиска пути
    useEffect(() => {
        if (!processIsActive) return;

        findPathInField({
            count,
            renderingDelay,
            field,
            startCell,
            endCell,
            setStatus
        });
    }, [processIsActive]);

    return (
        <>
            <Menu
                count={count}
                setCount={setCount}
                renderingDelay={renderingDelay}
                setRenderingDelay={setRenderingDelay}
                processIsActive={processIsActive}
                setProcessIsActive={setProcessIsActive}
                refreshField={refreshField}
                status={status}
            />

            {count <= 1 ? (
                <EmptyField />
            ) : (
                <Field
                    count={count}
                    field={field}
                    startCell={startCell}
                    setStartCell={setStartCell}
                    endCell={endCell}
                    setEndCell={setEndCell}
                    startEditorIsActive={startEditorIsActive}
                    setStartEditorIsActive={setStartEditorIsActive}
                    endEditorIsActive={endEditorIsActive}
                    setEndEditorIsActive={setEndEditorIsActive}
                    processIsActive={processIsActive}
                />
            )}
        </>
    );
}
