import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";

export default function Menu({
    count,
    setCount,
    processIsActive,
    setProcessIsActive,
    refreshField
}) {
    // Запустить процесс нахождения пути
    const runProcess = () => {
        setProcessIsActive(true);
    };

    // Изменить размеры поля
    const changeCountEvent = (event) => {
        const value = event.target.value;

        setCount(Math.min(Math.max(value, 0), 1000));
    };

    return (
        <MenuWrapper
            title="Муравьиный алгоритм"
            description="Сейчас вы узрите, как работает муравьиный алгоритм."
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
        </MenuWrapper>
    );
}
