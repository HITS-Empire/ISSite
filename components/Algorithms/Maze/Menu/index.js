import Input from "../../../Input";
import Button from "../../../Button";
import Status from "../../../Status";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import ButtonContainer from "../../../ButtonContainer";

export default function Menu({
    count,
    setCount,
    renderingDelay,
    setRenderingDelay,
    processIsActive,
    setProcessIsActive,
    refreshField,
    status
}) {
    // Запустить процесс нахождения пути
    const runProcess = () => {
        setProcessIsActive(true);
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
                label="Размеры поля"
                description="Введите размеры поля"
                isNumber={true}
                max={128}
                value={count}
                setValue={setCount}
                disabled={processIsActive}
            />

            <Input
                label="Задержка отрисовки"
                description="Введите задержку отрисовки"
                isNumber={true}
                max={1024}
                value={renderingDelay}
                setValue={setRenderingDelay}
                disabled={processIsActive}
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
                    {status ? "Отменить" : "Перезагрузить" }
                </Button>
            </ButtonContainer>

            <Status type={status}>
                {!!status && statusDescription}
            </Status>
        </MenuWrapper>
    );
}
