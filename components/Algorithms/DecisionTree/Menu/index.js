import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";

export default function Menu({
    maxDepth,
    setMaxDepth
}) {
    // Изменить максимальную глубину дерева
    const changeMaxDepthEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setMaxDepth(Math.min(Math.max(value, 0), 1024));
    };

    return (
        <MenuWrapper
            title="Дерево решений"
            description="Сейчас вы узрите, как работают предсказания на основе обучающих данных."
            css={{ width: "35%" }}
        >
            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="Максимальная глубина дерева"
                    description="Введите максимальную глубину дерева"
                    value={maxDepth}
                    disabled={false}
                    onChange={changeMaxDepthEvent}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={() => {}}
                    disabled={false}
                >
                    Добавить выборку
                </Button>

                <Button
                    type="soft"
                    onClick={() => {}}
                    disabled={false}
                >
                    Предсказать
                </Button>
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="soft"
                    onClick={() => {}}
                    disabled={false}
                >
                    Перезагрузить
                </Button>
            </div>
        </MenuWrapper>
    );
}
