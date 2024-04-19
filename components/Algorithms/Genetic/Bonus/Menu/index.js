import Input from "../../../../Input";
import Button from "../../../../Button";
import Status from "../../../../Status";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu({
    number,
    setNumber,
    status,
    setStatus,
    fitness,
    maxFitness
}) {
    // Запустить алгоритм
    const runProcess = () => {
        setStatus(1);
    };

    // Остановить алгоритм
    const stopProcess = () => {
        setStatus(0);
    };

    // Получить процент генерации кода
    const getAlgorithmPercent = () => {
        return ((maxFitness - fitness) / maxFitness * 100).toFixed(1);
    };

    return (
        <MenuWrapper
            title="Бонусный генетический алгоритм"
            description="Сейчас вы узрите, как выполняется генерация кода для последовательности Фибоначчи."
        >
            <Input
                label="Номер элемента"
                description="Введите номер элемента"
                isNumber={true}
                max={1024}
                value={number}
                setValue={setNumber}
                disabled={status === 1}
            />

            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={status !== 0}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={stopProcess}
                    disabled={status === 0}
                >
                    Отменить
                </Button>
            </ButtonContainer>

            <Status type={status - 1}>
                {status > 0 && (
                    status === 1 ? (
                        `Создание кода: ${getAlgorithmPercent()}%`
                    ) : (
                        "Алгоритм успешно создан!"
                    )
                )}
            </Status>
        </MenuWrapper>
    );
}
