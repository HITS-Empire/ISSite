import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import { getEmptyCell } from "../Utils/field";
import MenuWrapper from "../../../MenuWrapper";
import ButtonContainer from "../../../ButtonContainer";

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
        emptyCell.food = 16;

        setCellsWithFood([...cellsWithFood, emptyCell]);
        setEmptyCell(getEmptyCell(field));
    };

    return (
        <MenuWrapper
            className={style.menu}
            title="Муравьиный алгоритм"
            description="Сейчас вы узрите муравьиную колонию, которая кипит жизнью."
        >
            <Input
                label="Размеры поля"
                description="Введите размеры поля"
                isNumber={true}
                max={128}
                value={count}
                setValue={setCount}
                disabled={processIsActive}
            />

            <ButtonContainer>
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
            </ButtonContainer>

            <Input
                label="Количество муравьёв"
                description="Введите количество муравьёв"
                isNumber={true}
                max={64}
                value={population}
                setValue={setPopulation}
                disabled={processIsActive}
            />

            <ButtonContainer>
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
            </ButtonContainer>
        </MenuWrapper>
    );
}
