import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";

export default function Menu({
    count,
    setCount,
    refreshField
}) {
    const changeCountEvent = (event) => {
        const value = event.target.value;

        if (/^1?\d{0,2}$/.test(value)) {
            setCount(Math.max(value, 0));
        }
    };

    return (
        <div className={style.menu}>
            <p className={style.title}>А*</p>
            <span className={style.description}>
                Сейчас вы узрите, как работает алгоритм нахождения пути в лабиринте.
            </span>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="Размеры поля"
                    description="Введите размеры поля"
                    maxLength={3}
                    value={count}
                    onChange={changeCountEvent}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button type="primary">Запустить</Button>
                <Button type="soft" onClick={refreshField}>
                    Перезагрузить
                </Button>
            </div>
        </div>
    );
}
