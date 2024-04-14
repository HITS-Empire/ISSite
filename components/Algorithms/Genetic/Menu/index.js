import Input from "../../../Input";
import Button from "../../../Button";
import Status from "../../../Status";
import MenuWrapper from "../../../MenuWrapper";
import { getPopulation } from "../Utils/genetic";
import ButtonContainer from "../../../ButtonContainer";

export default function Menu({
    number,
    setNumber,
    setPopulation,
    status,
    setStatus,
}) {
    // Изменить номер нужного элемента последовательности
    const changeNumber = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setNumber(Math.min(Math.max(value, 0), 1024));
    };

    // Запустить алгоритм
    const runProcess = () => {
        setPopulation(getPopulation());
        setStatus(1);
    };

    // Остановить алгоритм
    const stopProcess = () => {
        setPopulation([]);
        setStatus(0);
    };

    return (
        <MenuWrapper
            title="Генетический алгоритм"
            description="Сейчас вы узрите, как выполняется генерация кода для вывода последовательности Фибоначчи."
        >
            <Input
                type="text"
                label="Номер элемента"
                description="Введите номер элемента"
                value={number}
                onChange={changeNumber}
                disabled={status !== 0}
            />

            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={number === 0 || status !== 0}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={stopProcess}
                    disabled={number === 0 || status === 0}
                >
                    Отменить
                </Button>
            </ButtonContainer>

            <Status type={status - 1}>
                {status > 0 && (
                    status === 1 ? (
                        "Выполняется создание алгоритма..."
                    ) : (
                        "Алгоритм успешно создан!"
                    )
                )}
            </Status>
        </MenuWrapper>
    );
}
