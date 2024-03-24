import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import { getEmptyCell } from "../Utils/field";

export default function Menu({
    count,
    setCount,
    field,
    population,
    setPopulation,
    emptyCell,
    setEmptyCell,
    cellsWithFood,
    setCellsWithFood,
    processIsActive,
    setProcessIsActive,
    processIsPaused,
    setProcessIsPaused,
    refreshField
}) {
    // Запустить процесс нахождения пути
    const runProcess = () => {
        setProcessIsActive(true);
    };

    // Поставить процесс на паузу или убрать с паузы
    const changeProcessPause = () => {
        setProcessIsPaused(!processIsPaused);
    };

    // Добавить еду
    const addFood = () => {
        emptyCell.food = 1;

        setCellsWithFood([...cellsWithFood, emptyCell]);
        setEmptyCell(getEmptyCell(field));
    };

    // Изменить размеры поля
    const changeCountEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setCount(Math.min(Math.max(value, 0), 128));
    };

    // Изменить количество муравьёв
    const changePopulationEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setPopulation(Math.min(Math.max(value, 0), 64));
    }

    return (
        <MenuWrapper
            title="Муравьиный алгоритм"
            description="Сейчас вы узрите муравьиную колонию, которая кипит жизнью."
        >
            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="Размеры поля"
                    description="Введите размеры поля"
                    value={count}
                    disabled={processIsActive}
                    onChange={changeCountEvent}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={count <= 1 || population < 1 || processIsActive}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={changeProcessPause}
                    disabled={!processIsActive}
                >
                    {processIsPaused ? "Возобновить" : "Остановить"}
                </Button>
            </div>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="Количество муравьёв"
                    description="Введите количество муравьёв"
                    value={population}
                    disabled={processIsActive}
                    onChange={changePopulationEvent}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={addFood}
                    disabled={count <= 1 || processIsActive && !processIsPaused || !emptyCell}
                >
                    Положить еду
                </Button>

                <Button
                    type="soft"
                    onClick={refreshField}
                    disabled={count <= 1}
                >
                    Перезагрузить
                </Button>
            </div>
        </MenuWrapper>
    );
}
