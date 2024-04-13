import Input from "../../../../Input";
import Button from "../../../../Button";
import { getPopulation } from "../Utils/genetic";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu({
    number,
    setNumber,
    setPopulation,
    processIsActive,
    setProcessIsActive
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
        setProcessIsActive(true);
    };

    // Остановить алгоритм
    const stopProcess = () => {
        setPopulation([]);
        setProcessIsActive(false);
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
                disabled={processIsActive}
            />

            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={runProcess}
                    disabled={processIsActive}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={stopProcess}
                    disabled={!processIsActive}
                >
                    Отменить
                </Button>
            </ButtonContainer>
        </MenuWrapper>
    );
}
