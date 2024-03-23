import MenuWrapper from "../../../MenuWrapper";
import Button from "../../../Button";
import style from "./style.module.scss";

export default function Menu({
    processIsActive,
    setProcessIsActive,
    status
}) {
    // Запустить процесс нахождения пути
    const runProcess = () => {
        setProcessIsActive(true);
    };

    let statusDescription;
    switch (status) {
        case "success":
            statusDescription = "Кластеризация прошла успешно";
            break;
        case "error":
            statusDescription = "Не удалось найти путь...";
    }

    return (
        <MenuWrapper
            title="Алгоритм кластеризации"
            description="Сейчас вы узрите, как работает алгоритм кластеризации."
        >
            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={processIsActive}
                >
                    Запустить
                </Button>
            </div>

            {status && (
                <span className={`${style.status} ${style[status]}`}>
                    {statusDescription}
                </span>
            )}
        </MenuWrapper>
    );
}
