import Button from "../../../Button";
import style from "./style.module.scss";

export default function Menu({
    count,
    setCount
}) {
    return (
        <div className={style.menu}>
            <p className={style.title}>А*</p>
            <span className={style.description}>
                Сейчас вы узрите, как работает алгоритм нахождения пути в лабиринте.
            </span>

            <div className={style.container}>
                <Button type="primary">Запустить</Button>
                <Button type="soft">Перезагрузить</Button>
            </div>
        </div>
    );
}
