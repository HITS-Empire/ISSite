import {
    runCode,
    getCodeFromProgram,
    getRatio
} from "../Utils/fibonacci";
import {
    getRandomIndex,
    getRandomElement
} from "../../../../../utils/helpers";
import Input from "../../../../Input";
import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import { getInitProgram } from "../Utils/fibonacci";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu({
    number,
    setNumber,
    setPopulation,
    correctOutput
}) {
    // Изменить номер нужного элемента последовательности
    const changeNumber = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setNumber(Math.min(Math.max(value, 0), 512));
    };

    const getRandomIndividual = () => {
        const individual = getInitProgram();

        const types = ["basic", "condition", "body", "console"];

        for (let i = 0; i < 128; i++) {
            const firstType = getRandomElement(types);
            const secondType = getRandomElement(types);
        
            const firstLine = getRandomElement(individual.find((part) => part.type === firstType).lines);
            const secondLine = getRandomElement(individual.find((part) => part.type === secondType).lines);

            for (let j = 0; j < 16; j++) {
                const firstIndex = getRandomIndex(firstLine);
                const secondIndex = getRandomIndex(secondLine);

                [
                    firstLine[firstIndex],
                    secondLine[secondIndex]
                ] = [
                    secondLine[secondIndex],
                    firstLine[firstIndex]
                ];
            }
        }

        return individual;
    }

    const setStartPopulation = () => {
        const newPopulation = [];
        
        // 256 - количество особей
        for (let i = 0; i < 256; i++) {
            const program = getRandomIndividual();
            const code = getCodeFromProgram(program);
            const output = runCode(code, number);

            const ratio = getRatio(output, correctOutput);

            newPopulation.push({ program, code, ratio });
        }

        newPopulation.sort((a, b) => {
            return Math.abs(1 - b.ratio) - Math.abs(1 - a.ratio)}
        );

        setPopulation(newPopulation);
    }

    // Остановить программу
    const stopProgram = () => {
        setPopulation([]);
    }

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
            />

            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={setStartPopulation}
                    disabled={number < 4}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={stopProgram}
                    disabled={number < 4}
                >
                    Отменить
                </Button>
            </ButtonContainer>
        </MenuWrapper>
    );
}
