import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";

export default function Menu({
    count,
    setCount,
    ants,
    setAnts,
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
    const changeProcess = () => {
        setProcessIsPaused(!processIsPaused);
    };

    // Изменить размеры поля
    const changeCountEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setCount(Math.min(Math.max(value, 0), 1000));
    };

    // Изменить количество муравьёв
    const changeAntsEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setAnts(Math.min(Math.max(value, 0), 64));
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
                    maxLength={4}
                    value={count}
                    disabled={processIsActive}
                    onChange={changeCountEvent}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={count <= 1 || processIsActive}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={refreshField}
                    disabled={count <= 1 || processIsActive}
                >
                    Перезагрузить
                </Button>
            </div>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="Количество муравьёв"
                    description="Введите количество муравьёв"
                    maxLength={2}
                    value={ants}
                    disabled={processIsActive}
                    onChange={changeAntsEvent}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={count <= 1 || processIsActive}
                >
                    Положить еду
                </Button>

                <Button
                    type="soft"
                    onClick={changeProcess}
                    disabled={!processIsActive}
                >
                    {processIsPaused ? "Возобновить" : "Остановить"}
                </Button>
            </div>
        </MenuWrapper>
    );
}
