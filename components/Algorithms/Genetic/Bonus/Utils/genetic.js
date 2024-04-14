import { 
    getRandomIndex, 
    getRandomElement
} from "../../../../../utils/helpers";
import { sleep } from "../../../../../utils/helpers";

const POPULATION_SIZE = 4096; // Количество особей в популяции
const MUTATION_RATE = 0.2; // Вероятность мутации
const CROSSOVER_IN_RIGHT_LINES_RATE = 0.001; // Вероятность кроссинговера в правильных линиях

// Информация о генах по типам
const infoAboutGenesByTypes = {
    "definition": ["let"],
    "variable": ["a", "b", "c", "i", "n"],
    "assignment": ["=", "+="],
    "operator": ["<", "+", "-"],
    "number": ["0", "1", "2"]
};

// Выполнить код в изменённом контексте console.log
export function runCode(code, n = 0) {
    const messages = [];
    const console = {};

    console.log = (message) => messages.push(message);
    n;

    try {
        eval(code);
    } catch (error) {
        messages.push(error.message);
    }

    return messages;
};

// Получить часть программы
export function getPartOfProgram(type) {
    switch (type) {
        case "basic":
            return {
                type: "basic",
                lines: [
                    ["let", "i", "=", "0"],
                    ["let", "a", "=", "1"],
                    ["let", "b", "=", "1"],
                    ["let", "c"]
                ]
            };
        case "condition":
            return {
                type: "condition",
                lines: [
                    ["i", "<", "n", "-", "2"]
                ]
            };
        case "body":
            return {
                type: "body",
                lines: [
                    ["c", "=", "a", "+", "b"],
                    ["a", "=", "b"],
                    ["b", "=", "c"],
                    ["i", "+=", "1"]
                ]
            };
        case "console":
            return {
                type: "console",
                lines: [
                    ["b"]
                ]
            };
    }
}

// Получить начальную программу
export function getProgram(phase = 0) {
    const program = [getPartOfProgram("basic")];

    if (phase > 0) {
        program.push(getPartOfProgram("condition"), getPartOfProgram("body"));
    }
    if (phase > 1) {
        program.push(getPartOfProgram("console"));
    }

    return program;
};

export function shuffleProgram(program, count = 128) {
    for (let i = 0; i < count; i++) {
        const randomPart = getRandomElement(program);

        const firstLine = getRandomElement(randomPart.lines);
        const secondLine = getRandomElement(randomPart.lines);

        for (let j = 0; j < 4; j++) {
            const firstIndex = getRandomIndex(firstLine);
            const secondIndex = getRandomIndex(secondLine);

            [
                firstLine[firstIndex], secondLine[secondIndex]
            ] = [
                secondLine[secondIndex], firstLine[firstIndex]
            ];
        }
    }
};

// Получить линии программы по типу
export function getLinesFromType(program, type) {
    return program.find((part) => part.type === type)?.lines.map((line) => line.join(" "));
}

// Получить код по структуре программы
export function getCodeFromProgram(program) {
    const lines = [getLinesFromType(program, "basic")];

    const conditionLine = getLinesFromType(program, "condition")?.join(" ");
    if (conditionLine) {
        lines.push([
            `while (${conditionLine}) {`,
            ...getLinesFromType(program, "body").map((line) => "    " + line),
            "}"
        ]);
    }

    const consoleLine = getLinesFromType(program, "console")?.join(" ");
    if (consoleLine) {
        lines.push([`console.log(${consoleLine})`]);
    }

    return lines.map((line) => line.join("\n")).join("\n\n");
}

// Проверить линию на правильность
export function lineIsRight(line) {
    const typesOfGenes = line.map((gen) => {
        for (const type in infoAboutGenesByTypes) {
            if (infoAboutGenesByTypes[type].indexOf(gen) !== -1) {
                return type;
            }
        }
    });

    let countOfAssignments = 0;

    for (let i = 0; i < line.length; i++) {
        const typeOfGen = typesOfGenes[i];

        if (typeOfGen === "definition") {
            if (i > 0 || line.length === 1) return false;

            const typeOfNextGen = typesOfGenes[i + 1];

            if (typeOfNextGen !== "variable") return false;
        }
        if (typeOfGen === "assignment") {
            if (i === 0 || i === line.length - 1) return false;

            countOfAssignments++;

            if (countOfAssignments > 1) return false;

            const typeOfPreviosGen = typesOfGenes[i - 1];
            const typeOfNextGen = typesOfGenes[i + 1];

            if (typeOfPreviosGen !== "variable") return false;
            if (typeOfNextGen !== "variable" && typeOfNextGen !== "number") return false;
        }
        if (typeOfGen === "operator") {
            if (i === 0 || i === line.length - 1) return false;

            const typeOfPreviosGen = typesOfGenes[i - 1];
            const typeOfNextGen = typesOfGenes[i + 1];

            if (typeOfPreviosGen !== "variable" && typeOfPreviosGen !== "number") return false;
            if (typeOfNextGen !== "variable" && typeOfNextGen !== "number") return false;
        }
        if (typeOfGen === "variable" || typeOfGen === "number") {
            if (i > 0) {
                const typeOfPreviosGen = typesOfGenes[i - 1];
                if (typeOfPreviosGen === "variable" || typeOfPreviosGen === "number") return false;
            }
            if (i < line.length - 1) {
                const typeOfNextGen = typesOfGenes[i + 1];
                if (typeOfNextGen === "variable" || typeOfNextGen === "number") return false;
            }
        }
    }

    return true;
}

// Получить количество правильных линий в программе
export function getCountOfRightLines(program) {
    let count = 0;

    program.forEach((part) => {
        part.lines.forEach((line) => {
            count += lineIsRight(line);
        });
    });

    return count;
}

// Получить начальную популяцию
export function getPopulation() {
    const population = [];
    const phase = 0;

    for (let i = 0; i < POPULATION_SIZE; i++) {
        const program = getProgram(phase);

        shuffleProgram(program);

        const countOfRightLines = getCountOfRightLines(program);

        population.push({
            program,
            phase,
            countOfRightLines
        });
    }

    return population;
}

// Получить разницу между выводом и искомым значением
export function getDifference(value, correctValue) {
    if (typeof value === "string") return Infinity;
    return Math.abs(value - correctValue);
}

// Кроссинговер
export function crossover(firstIndividual, secondIndividual) {
    const phase = Math.min(firstIndividual.phase, secondIndividual.phase);
    const childProgram = getProgram(phase);

    const linesForCrossover = []; // Линии, которые будут подвержены кроссинговеру

    const firstGenes = []; // Все гены из линий для кроссинговера
    const secondGenes = []; // Все гены, которые нужно скопировать

    // Индекс случайной части программы для кроссинговера
    const indexOfRandomPart = getRandomIndex(childProgram);

    // Скопировать первую программу и заполнить информацию для кроссинговера
    childProgram.forEach((part, index) => {
        part.lines = firstIndividual.program[index].lines.map((line) => {
            const copyOfLine = [...line];

            if (index === indexOfRandomPart) {
                if (!lineIsRight(line) || Math.random() < CROSSOVER_IN_RIGHT_LINES_RATE) {
                    linesForCrossover.push(copyOfLine);
                    firstGenes.push(...line);
                }
            }

            return copyOfLine;
        });

        if (index === indexOfRandomPart) {
            secondIndividual.program[index].lines.forEach((line) => {
                if (!lineIsRight(line) || Math.random() < CROSSOVER_IN_RIGHT_LINES_RATE) {
                    secondGenes.push(...line);
                }
            });
        }
    });

    const commonGenes = []; // Общие гены для обеих частей
    const remainingGenes = []; // Оставшиеся гены

    // Получить общие гены для обеих частей
    firstGenes.forEach((gen) => {
        const index = secondGenes.indexOf(gen);

        if (index === -1) {
            remainingGenes.push(gen);
        } else {
            secondGenes.splice(index, 1);
            commonGenes.push(gen);
        }
    });

    const allGenes = [...commonGenes, ...remainingGenes]; // Все гены для вставки
    allGenes.sort(() => Math.random() - 0.5);

    let index = 0;

    for (let i = 0; i < linesForCrossover.length; i++) {
        linesForCrossover[i] = allGenes.slice(index, index + linesForCrossover[i].length);
        index += linesForCrossover[i].length;
    }

    return childProgram;
}

// Мутация
export function mutation(program) {
    for (let i = 0; i < 4; i++) {
        if (Math.random() < MUTATION_RATE) {
            shuffleProgram(program, 1);
        }
    }
}

// Вырастить особь
export function raise(program, phase = 0) {
    const growth = [];

    if (phase === 0) {
        growth.push(getPartOfProgram("condition"), getPartOfProgram("body"));
    }
    if (phase === 1) {
        growth.push(getPartOfProgram("console"));
    }

    shuffleProgram(growth);

    program.push(...growth);

    return getCountOfRightLines(growth);
}

// Одна итерация генетического алгоритма
export async function runGenetic({
    code,
    setCode,
    output,
    setOutput,
    number,
    population,
    setPopulation,
    correctValue
}) {
    for (let i = 0; i < POPULATION_SIZE; i += 2) {
        const firstIndividual = population[i];
        const secondIndividual = population[i + 1];

        const firstNewProgram = crossover(firstIndividual, secondIndividual);
        const secondNewProgram = crossover(secondIndividual, firstIndividual);

        mutation(firstNewProgram);
        mutation(secondNewProgram);

        let firstCountOfRightLines = getCountOfRightLines(firstNewProgram);
        let secondCountOfRightLines = getCountOfRightLines(secondNewProgram);

        const newPhase = Math.min(firstIndividual.phase, secondIndividual.phase);

        let firstNewPhase = newPhase;
        let secondNewPhase = newPhase;

        if (firstNewPhase === 0 && firstCountOfRightLines > 3) {
            firstCountOfRightLines += raise(
                firstNewProgram,
                firstNewPhase
            );
            firstNewPhase++;
        }
        if (firstNewPhase === 1 && firstCountOfRightLines > 8) {
            firstCountOfRightLines += raise(
                firstNewProgram,
                firstNewPhase
            );
            firstNewPhase++;
        }

        if (secondNewPhase === 0 && secondCountOfRightLines > 3) {
            secondCountOfRightLines += raise(
                secondNewProgram,
                secondNewPhase
            );
            secondNewPhase++;
        }
        if (secondNewPhase === 1 && secondCountOfRightLines > 8) {
            secondCountOfRightLines += raise(
                secondNewProgram,
                secondNewPhase
            );
            secondNewPhase++;
        }

        const firstNewIndividual = {
            program: firstNewProgram,
            phase: firstNewPhase,
            countOfRightLines: firstCountOfRightLines
        };
        const secondNewIndividual = {
            program: secondNewProgram,
            phase: secondNewPhase,
            countOfRightLines: secondCountOfRightLines
        };

        if (firstNewPhase === 2) {
            const firstNewCode = getCodeFromProgram(firstNewProgram);
            const firstNewOutput = runCode(firstNewCode, number);
            const firstNewDifference = getDifference(firstNewOutput[0], correctValue);

            firstNewIndividual.code = firstNewCode;
            firstNewIndividual.difference = firstNewDifference;
        }

        if (secondNewPhase === 2) {
            const secondNewCode = getCodeFromProgram(secondNewProgram);
            const secondNewOutput = runCode(secondNewCode, number);
            const secondNewDifference = getDifference(secondNewOutput[0], correctValue);

            secondNewIndividual.code = secondNewCode;
            secondNewIndividual.difference = secondNewDifference;
        }

        population.push(firstNewIndividual, secondNewIndividual);
    }

    population.sort((a, b) => {
        if (a.phase !== b.phase) {
            return b.phase - a.phase;
        }
        if (a.phase < 2 || a.difference === Infinity && b.difference === Infinity) {
            if (a.countOfRightLines !== b.countOfRightLines) {
                return b.countOfRightLines - a.countOfRightLines;
            }
            return Math.random() - 0.5;
        }
        if (a.difference !== b.difference) {
            return a.difference - b.difference;
        }
        return Math.random() - 0.5;
    });

    await sleep(0);

    setPopulation(population.slice(0, POPULATION_SIZE));

    const newCode = population[0].code || getCodeFromProgram(population[0].program);

    if (code !== newCode) {
        setCode(newCode);
    } else {
        setOutput([...output]);
    }
}
