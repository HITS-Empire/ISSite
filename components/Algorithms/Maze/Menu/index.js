import Input from "../../../Input";
import Button from "../../../Button";
import Status from "../../../Status";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import ButtonContainer from "../../../ButtonContainer";

export default function Menu({
    count,
    setCount,
    processIsActive,
    setProcessIsActive,
    refreshField,
    status
}) {
    // Запустить процесс нахождения пути
    const runProcess = () => {
        setProcessIsActive(true);
    };

    // Изменить размеры поля
    const changeCountEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setCount(Math.min(Math.max(value, 0), 128));
    };

    let statusDescription;
    switch (status) {
        case 1:
            statusDescription = "Путь успешно найден!";
            break;
        case 2:
            statusDescription = "Не удалось найти путь...";
    }

    return (
        <MenuWrapper
            className={style.menu}
            title="А*"
            description="Сейчас вы узрите, как работает алгоритм нахождения пути в лабиринте."
        >
            <Input
                type="text"
                label="Размеры поля"
                description="Введите размеры поля"
                maxLength={4}
                value={count}
                disabled={processIsActive}
                onChange={changeCountEvent}
            />

            <ButtonContainer>
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
                    disabled={count <= 1 || processIsActive && !status}
                >
                    Перезагрузить
                </Button>
            </ButtonContainer>

            <Status type={status}>
                {status && statusDescription}
            </Status>
        </MenuWrapper>
    );
}
