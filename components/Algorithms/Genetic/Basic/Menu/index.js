import Status from "../../../../Status";
import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu({
    vertices,
    status,
    setStatus
}) {
    // Запустить алгоритм
    const runProcess = () => {
        setStatus(1);
    };

    // Остановить алгоритм
    const stopProcess = () => {
        setStatus(0);
    };

    return (
        <MenuWrapper
            title="Базовый генетический алгоритм"
            description="Сейчас вы узрите, как работает алгоритм нахождения кратчайшего пути в задаче коммивояжёра."
        >
            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={vertices.length <= 1}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={stopProcess}
                >
                    Отменить
                </Button>
            </ButtonContainer>

            <Status type={status - 1}>
                {status > 0 && (
                    status === 1 ? (
                        "Выполняется поиск пути..."
                    ) : (
                        "Путь успешно найден!"
                    )
                )}
            </Status>
        </MenuWrapper>
    );
}
