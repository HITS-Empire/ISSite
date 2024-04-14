import { 
    getRandomIndex, 
    getRandomElement
} from "../../../../../utils/helpers";
import { sleep } from "../../../../../utils/helpers";

const POPULATION_SIZE = 4096; // Количество особей в популяции
const MUTATION_RATE = 0.2; // Вероятность мутации
const CROSSOVER_IN_RIGHT_LINES_RATE = 0.001; // Вероятность кроссинговера в правильных линиях

// Информация о возможных генах в программе
const infoAboutGensInProgram = {
    "basic": {
        set: ["let", "a", "b", "c", "i", "=", "0", "1"],
        count: {
            "let": 4,
            "a": 1,
            "b": 1,
            "c": 1,
            "i": 1,
            "=": 3,
            "0": 1,
            "1": 2
        }
    },
    "condition": {
        set: ["i", "<", "n", "-", "2"],
        count: {
            "i": 1,
            "<": 1,
            "n": 1,
            "-": 1,
            "2": 1
        }
    },
    "body": {
        set: ["a", "b", "c", "i", "=", "+", "+=", "1"],
        count: {
            "a": 2,
            "b": 3,
            "c": 2,
            "i": 1,
            "=": 3,
            "+": 1,
            "+=": 1,
            "1": 1
        }
    },
    "console": {
        set: ["b"],
        count: {
            "b": 1
        }
    }
};

// Информация о генах по типам
const infoAboutGenesByTypes = {
    "definition": ["let"],
    "variable": ["a", "b", "c", "i", "n"],
    "assignment": ["=", "+="],
    "operator": ["<", "+", "-"],
    "number": ["0", "1", "2"]
};

const types = ["basic", "condition", "body", "console"];

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

        if (typeOfGen === "let") {
            if (i > 0 || line.length === 1) return false;
            if (typesOfGenes[i + 1] !== "variable") return false;
            if (line.length > 2 && typesOfGenes[i + 2] !== "assignment") return false;
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
        if (typeOfGen === "variable") {
            if (i > 0) {
                const typeOfPreviosGen = typesOfGenes[i - 1];
                if (typeOfPreviosGen === "variable" || typeOfPreviosGen === "number") return false;
            }
            if (i < line.length - 1) {
                const typeOfNextGen = typesOfGenes[i + 1];
                if (typeOfNextGen === "variable" || typeOfNextGen === "number") return false;
            }
        }
        if (typeOfGen === "number") {
            if (i > 0) {
                const typeOfPreviosGen = typesOfGenes[i - 1];
                if (typeOfPreviosGen !== "operator") return false;
            }
            if (i < line.length - 1) {
                const typeOfNextGen = typesOfGenes[i + 1];
                if (typeOfNextGen !== "operator") return false;
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
            countOfRightLines,
            phase
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
export function $crossover(firstProgram, secondProgram) {
    // Индекс, до которого будет выполняться кроссинговер
    const maxCrossoverCount = Math.min(firstProgram.length, secondProgram.length);

    // Определить фазу программы
    const phase = maxCrossoverCount === 1 ? 0 : maxCrossoverCount === 3 ? 1 : 2;

    const newProgram = getProgram(phase);

    shuffleProgram(newProgram);

    let indexOfRandomPart, randomPart;
    let indexOfRandomLine, randomLine;

    do {
        indexOfRandomPart = Math.floor(Math.random() * maxCrossoverCount);
        randomPart = newProgram[indexOfRandomPart];

        console.log(indexOfRandomPart, randomPart);

        indexOfRandomLine = getRandomIndex(randomPart.lines);
        randomLine = randomPart.lines[indexOfRandomLine];

        // Если выбрали работающую линию
        if (Math.random() < CROSSOVER_IN_RIGHT_LINES_RATE) break;
    } while ((
        lineIsRight(firstProgram[indexOfRandomPart].lines[indexOfRandomLine])
    ) && (
        lineIsRight(secondProgram[indexOfRandomPart].lines[indexOfRandomLine])
    ));

    // Использованные гены
    const usedGenes = [];

    let index;
    let k = 0;

    const breakPointIndex = getRandomIndex(randomLine);

    for (let indexOfPart = 0; indexOfPart < maxCrossoverCount; indexOfPart++) {
        if (indexOfPart !== indexOfRandomPart) {
            // Полностью скопировать линии первой программы
            newProgram[indexOfPart].lines = firstProgram[indexOfPart].lines.map((line) => {
                for (const gen of line) {
                    usedGenes.push(gen);
                }

                return [...line];
            });

            continue;
        }

        const linesFromFirstProgram = firstProgram[indexOfPart].lines;
        const stopMark = Math.min(indexOfRandomLine + 1, linesFromFirstProgram.length);

        for (k; k < stopMark; k++) {
            if (k !== indexOfRandomLine) {
                // Скопировать одну линию первой программы
                newProgram[indexOfPart].lines[k] = firstProgram[indexOfPart].lines[k].map((gen) => {
                    usedGenes.push(gen);

                    return gen;
                });

                continue;
            }

            for (let i = 0; i < breakPointIndex; i++) {
                const gen = linesFromFirstProgram[k][i];

                randomLine[i] = gen;
                usedGenes.push(gen);
            }
        }

        index = indexOfPart;

        if (k === indexOfRandomLine) break;
    }

    return newProgram;
}

export function crossover(firstProgram, secondProgram) {
    const newTypes = Object
        .keys(infoAboutGensInProgram)
        .slice(0, Math.min(firstProgram.length, secondProgram.length));

    const allGens = [];
    const repetitiveGens = [];

    // Заполнить массивы генов по типу части программы
    const fillGenes = (type) => {
        for (const gen of infoAboutGensInProgram[type].set) {
            if (!allGens.includes(gen)) allGens.push(gen);

            if (infoAboutGensInProgram[type].count[gen] > 1) {
                if (!repetitiveGens.includes(gen)) {
                    repetitiveGens.push(gen, infoAboutGensInProgram[type].count[gen]);
                } else {
                    repetitiveGens[repetitiveGens.indexOf(gen) + 1] += infoAboutGensInProgram[type].count[gen];
                }
            }
        }
    };

    let phase = 0;

    fillGenes("basic");

    if (newTypes.length > 1) {
        fillGenes("condition");
        fillGenes("body");
        phase++;
    }

    if (newTypes.length > 3) {
        fillGenes("console");
        phase++;
    }

    const newInd = getProgram(phase);

    shuffleProgram(newInd);

    let type = getRandomElement(newTypes);

    let newIndLineIndex = getRandomIndex(newInd.find((part) => part.type === type).lines);
    let newIndLine = newInd.find((part) => part.type === type).lines[newIndLineIndex];

    const conditionOfAvailableLine = 1 / 100;

    // Если выбрали работающую линию
    while (lineIsRight(firstProgram.find((part) => part.type === type).lines[newIndLineIndex]) && lineIsRight(secondProgram.find((part) => part.type === type).lines[newIndLineIndex])) {
        if (Math.random() < conditionOfAvailableLine) break;
        type = getRandomElement(newTypes);

        newIndLineIndex = getRandomIndex(newInd.find((part) => part.type === type).lines);
        newIndLine = newInd.find((part) => part.type === type).lines[newIndLineIndex];
    }
    
    // Использованные гены
    const usedGens = [];

    let index;
    let k = 0;

    const breakPointIndex = getRandomIndex(newIndLine);

    for (let i = 0; i < newTypes.length; i++) {
        if (newTypes[i] === type) {
            const firstProgramLines = firstProgram.find((part) => part.type === type).lines;

            while (k < firstProgramLines.length) {
                if (k === newIndLineIndex) {
                    for (let j = 0; j < breakPointIndex; j++) {
                        const newGen = firstProgramLines[k][j];
                        newIndLine[j] = newGen;
                        usedGens.push(newGen);
                    }

                    break;
                } else {
                    const newIndPartIndex = newInd.findIndex((part) => part.type === newTypes[i]);
                    const newLine = firstProgram.find((part) => part.type === newTypes[i]).lines[k];
                    newInd[newIndPartIndex].lines[k] = [...newLine];

                    for (let j = 0; j < newLine.length; j++) {
                        const newGen = firstProgram.find((part) => part.type === type).lines[k][j];
                        usedGens.push(newGen);
                    }
                }

                k++;
            }
            index = i;

            if (k === newIndLineIndex) break;
        } else {
            const newIndPartIndex = newInd.findIndex((part) => part.type === newTypes[i]);
            const newLines = firstProgram.find((part) => part.type === newTypes[i]).lines;
            newInd[newIndPartIndex].lines = newLines.map((line) => [...line]);

            for (const newLine of newLines) {
                for (let k = 0; k < newLine.length; k++) {
                    usedGens.push(newLine[k]);
                }
            }
        }
    }
    
    for (let i = index; i < newTypes.length; i++) {
        if (newTypes[i] === type) {
            const secondProgramLines = secondProgram.find((part) => part.type === type).lines;

            while (k < secondProgramLines.length) {
                if (k === newIndLineIndex) {
                    for (let j = breakPointIndex; j < secondProgramLines[k].length; j++) {
                        const newGen = secondProgramLines[k][j];

                        if (!usedGens.includes(newGen) || (usedGens.includes(newGen) && repetitiveGens.includes(newGen) && usedGens.filter((gen) => gen === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1])) {
                            newIndLine[j] = newGen;
                            usedGens.push(newGen);
                        } else {
                            newIndLine[j] = "skipped";
                        }
                    }
                } else {
                    const newIndPartIndex = newInd.findIndex((part) => part.type === newTypes[i]);
                    const newLine = secondProgram.find((part) => part.type === newTypes[i]).lines[k];

                    for (let j = 0; j < newLine.length; j++) {
                        const newGen = newLine[j];
                        if (!usedGens.includes(newGen) || usedGens.includes(newGen) && repetitiveGens.includes(newGen) && usedGens.filter((gen) => gen === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1]) {
                            newInd[newIndPartIndex].lines[k][j] = newLine[j];
                            usedGens.push(newGen);
                        } else {
                            newInd[newIndPartIndex].lines[k][j] = "skipped";
                        }
                    }
                }

                k++;
            }
        } else {
            const newIndPartIndex = newInd.findIndex((part) => part.type === newTypes[i]);
            const newLines = secondProgram.find((part) => part.type === newTypes[i]).lines;
            
            for (let j = 0; j < newLines.length; j++) {
                const newLine = newLines[j];

                for (let h = 0; h < newLine.length; h++) {
                    const newGen = newLine[h];

                    if (!usedGens.includes(newGen)) {        
                        newInd[newIndPartIndex].lines[j][h] = newGen;
                        usedGens.push(newGen);
                    } else {
                        if (repetitiveGens.includes(newGen)) {
                            if (usedGens.filter((element) => element === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1]) {
                                newInd[newIndPartIndex].lines[j][h] = newGen;
                                usedGens.push(newGen);
                            } else {
                                newInd[newIndPartIndex].lines[j][h] = "skipped";
                            }
                        } else {
                            newInd[newIndPartIndex].lines[j][h] = "skipped";
                        }
                    }
                }
            }
        }
    }

    const newIndPartIndex = newInd.findIndex((part) => part.type === type);
    newInd[newIndPartIndex].lines[newIndLineIndex] = newIndLine;

    for (let i = 0; i < newTypes.length; i++) {
        const newLines = newInd.find((part) => part.type === newTypes[i]).lines;

        for (let j = 0; j < newLines.length; j++) {
            const newLine = newLines[j];

            for (let h = 0; h < newLine.length; h++) {
                if (newLine[h] === "skipped") {
                    for (let gen of allGens) {
                        if (!usedGens.includes(gen) || usedGens.includes(gen) && repetitiveGens.includes(gen) && usedGens.filter((usedGen) => gen === usedGen).length < repetitiveGens[repetitiveGens.indexOf(gen) + 1]) {
                            newLine[h] = gen;
                            usedGens.push(gen);
                            break;
                        }
                    }
                }
            }
        }
    }

    return newInd;
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

    for (let i = 0; i < POPULATION_SIZE; i++) {
        const firstIndividual = getRandomElement(population);
        const secondIndividual = getRandomElement(population);

        const firstNewProgram = crossover(firstIndividual.program, secondIndividual.program);
        const secondNewProgram = crossover(secondIndividual.program, firstIndividual.program);

        mutation(firstNewProgram);
        mutation(secondNewProgram);

        let firstCountOfRightLines = getCountOfRightLines(firstNewProgram);
        let secondCountOfRightLines = getCountOfRightLines(secondNewProgram);

        let firstNewPhase = firstIndividual.phase;
        let secondNewPhase = secondIndividual.phase;

        if (firstNewPhase === 0 && firstCountOfRightLines > 2) {
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

        if (secondNewPhase === 0 && secondCountOfRightLines > 2) {
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
        if (a.phase < 2) {
            if (a.countOfRightLines !== b.countOfRightLines) {
                return b.countOfRightLines - a.countOfRightLines;
            }
            return Math.random() - 0.5;
        }
        return a.difference - b.difference;
    });

    await sleep(50);

    setPopulation(population.slice(0, POPULATION_SIZE));

    const newCode = population[0].code || getCodeFromProgram(population[0].program);

    if (code !== newCode) {
        setCode(newCode);
    } else {
        setOutput([...output]);
    }
}
