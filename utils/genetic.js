import {
    copy,
    getRandomNumber,
    getRandomElement
} from "./helpers";

const COUNTERS = "ijklm"; // Названия счётчиков
const VARIABLES = "abcdefghopqrstuvwxyz"; // Названия переменных
const VARIABLES_COUNT = 3; // Количество переменных в программе (min: 1, max: 20)
const MAX_PROGRAM_DEPTH = 4; // Максимальная глубина программы (min: 2, max: 7)
const MAX_OPERATION_COUNT = 8; // Максимальное количество операций

const SEQUENCE_SIZE = 16; // Количество первых чисел для сравнения
const POPULATION_SIZE = 128; // Количество особей в популяции
const MUTATION_RATE = 0.4; // Вероятность мутации
const RAISE_RATE = 0.4; // Вероятность роста

// Доступные переменные
const AVAILABLE_VARIABLES = VARIABLES.slice(0, VARIABLES_COUNT);

// Выполнить код в изменённом контексте console.log
export function runCode(code, number = -1) {
    const messages = [];
    const console = {};

    console.log = (message) => messages.push(String(message));

    const evalWrapper = (n) => {
        try {
            eval(code);    
        } catch (error) {
            messages.push(error.message);
        }
    };

    if (number === -1) {
        for (let i = 0; i < SEQUENCE_SIZE; i++) {
            evalWrapper(i);
        }
    } else {
        evalWrapper(number);
    }

    if (messages.length === 0) {
        messages.push("Console is empty");
    }

    return messages;
}

// Получить нужное количество отступов для программы
export function getSpaces(count) {
    return new Array(count * 4).fill(" ").join("");
}

// Получить код из программы
export function getCodeFromProgram(operation, count = 0) {
    if (typeof operation === "string") return operation;

    const { type, body } = operation;

    const spaces = getSpaces(count);

    switch (type) {
        case "program":
            return body.map((value) => {
                return `${spaces}${getCodeFromProgram(value, count)}`;
            }).join("\n");
        case "definition":
            return body.map((value) => {
                return `${spaces}let ${getCodeFromProgram(value, count)} = 0`;
            }).join("\n");
        case "increment":
            return body.map((value) => {
                return `${spaces}${getCodeFromProgram(value, count)}++`;
            }).join("\n");
        case "addition":
            return body.map((value) => getCodeFromProgram(value, count)).join(" + ");
        case "assignment":
            return `${spaces}${body.map((value) => getCodeFromProgram(value, count)).join(" = ")}`;
        case "cycle":
            const counter = COUNTERS[count];

            return [
                `${spaces}for (let ${counter} = 0; ${counter} < n; ${counter}++) {`,
                body.map((value) => getCodeFromProgram(value, count + 1)).join("\n"),
                `${spaces}}`
            ].join("\n");
        case "console":
            return `${spaces}console.log(${body.map((value) => getCodeFromProgram(value)).join(", ")})`;
    }
}

// Получить корректную программу для чисел Фибоначчи
export function getCorrectFibonacciProgram() {
    return {
        type: "program",
        body: [
            {
                type: "definition",
                body: ["a", "b", "c"]
            },
            {
                type: "increment",
                body: ["b"]
            },
            {
                type: "cycle",
                body: [
                    {
                        type: "assignment",
                        body: [
                            "c",
                            {
                                type: "addition",
                                body: ["a", "b"]
                            }
                        ]
                    },
                    {
                        type: "assignment",
                        body: ["a", "b"]
                    },
                    {
                        type: "assignment",
                        body: ["b", "c"]
                    }
                ]
            },
            {
                type: "console",
                body: ["a"]
            }
        ]
    };
}

// Получить корректный вывод для чисел Фибоначчи
export function getCorrectFibonacciOutput() {
    return runCode(getCodeFromProgram(getCorrectFibonacciProgram()), -1);
}

// Получить случайную программу
export function getRandomProgram(parent = null, depth = 0) {
    let type, body = [];

    if (parent === "program" || parent === "cycle") {
        const types = ["increment", "assignment"];

        if (depth < MAX_PROGRAM_DEPTH - 1) {
            types.push("cycle");
        }

        type = getRandomElement(types);

        if (type === "increment") {
            body.push(getRandomElement(AVAILABLE_VARIABLES));
        }
        if (type === "assignment") {
            body.push(
                getRandomElement(AVAILABLE_VARIABLES),
                getRandomProgram("assignment", depth + 1)
            );
        }
        if (type === "cycle") {
            const count = getRandomNumber(MAX_OPERATION_COUNT - 1) + 1;

            for (let i = 0; i < count; i++) {
                body.push(getRandomProgram("cycle", depth + 1));
            }
        }
    }
    if (parent === "assignment" || parent === "console") {
        if (depth >= MAX_PROGRAM_DEPTH || Math.random() < 0.5) {
            return getRandomElement(AVAILABLE_VARIABLES);
        }

        type = "addition";

        body.push(
            getRandomElement(AVAILABLE_VARIABLES),
            getRandomElement(AVAILABLE_VARIABLES)
        );
    }
    if (!parent) {
        type = "program";

        const count = getRandomNumber(MAX_OPERATION_COUNT - 2) + 2;

        body.push({
            type: "definition",
            body: Array.from(AVAILABLE_VARIABLES)
        });

        for (let i = 0; i < count; i++) {
            body.push(getRandomProgram("program", depth + 1));
        }

        body.push({
            type: "console",
            body: [getRandomProgram("console", depth + 2)]
        });
    }

    return {
        type,
        body
    };
}

// Отсортировать популяцию по крутости
export function sortPopulation(population) {
    population.sort((a, b) => {
        if (a.fitness === Infinity && b.fitness === Infinity || a.fitness === b.fitness) {
            return Math.random() - 0.5;
        }

        if (a.fitness === Infinity) return 1;
        if (b.fitness === Infinity) return -1;

        return a.fitness - b.fitness;
    });
}

// Получить начальную популяцию
export function getPopulation(correctOutput) {
    const population = [];

    for (let i = 0; i < POPULATION_SIZE; i++) {
        const program = getRandomProgram();
        const code = getCodeFromProgram(program);
        const output = runCode(code, -1);
        const fitness = getFitness(output, correctOutput);

        population.push({ program, code, fitness });
    }

    sortPopulation(population);

    return population;
}

// Получить разницу между выводом и искомым значением
export function getFitness(output, correctOutput) {
    let fitness = 0;
    
    for (let i = 0; i < output.length; i++) {
        if (Number.isNaN(Number(output[i]))) return Infinity;

        fitness += Math.abs(output[i] - correctOutput[i]);
    }

    return fitness;
}

// Кроссинговер
export function crossover(firstProgram, secondProgram) {
    const firstGenes = firstProgram.body.slice(1, -1);
    const secondGenes = secondProgram.body.slice(1, -1);

    // Случайный разделитель
    const separator = getRandomNumber(Math.min(firstGenes, secondGenes));

    // Начать программу с определения переменных
    const body = [copy(firstProgram.body[0])];

    // Скопировать часть из первой программы
    body.push(...copy(firstGenes.slice(0, separator)));

    // Скопировать часть из второй программы
    body.push(...copy(secondGenes.slice(separator)));

    // Закончить программу выводом в консоль
    body.push(copy(firstProgram.body[firstProgram.body.length - 1]));

    return {
        type: "program",
        body
    };
}

// Мутация
export function mutation(program, depth = 0) {
    const { type, body } = program;

    for (let i = 0; i < body.length; i++) {
        if (type === "program") {
            if (i === 0) continue;

            if (i === body.length - 1) {
                if (Math.random() < MUTATION_RATE) {
                    body[i].body[0] = getRandomProgram("console", depth + 2);
                }

                continue;
            }
        }

        if (Math.random() < MUTATION_RATE) {
            body[i] = getRandomProgram(type, depth + 1);
        } else if (typeof body[i] !== "string") {
            mutation(body[i], depth + 1);
        }
    }
}

// Рост
export function raise(program) {
    if (Math.random() < RAISE_RATE && program.body.length - 2 < MAX_OPERATION_COUNT) {
        program.body.push(getRandomProgram("program", 1), program.body.pop());
    }
}

// Одна итерация генетического алгоритма
export function runGenetic(population, correctOutput) {
    for (let i = 0; i < POPULATION_SIZE - 1; i++) {
        const firstProgram = population[i].program;
        const secondProgram = population[i + 1].program;

        const firstNewProgram = crossover(firstProgram, secondProgram);
        const secondNewProgram = crossover(secondProgram, firstProgram);

        mutation(firstNewProgram);
        mutation(secondNewProgram);

        raise(firstNewProgram);
        raise(secondNewProgram);

        const firstNewCode = getCodeFromProgram(firstNewProgram);
        const firstNewOutput = runCode(firstNewCode, -1);
        const firstNewFitness = getFitness(firstNewOutput, correctOutput);

        const secondNewCode = getCodeFromProgram(secondNewProgram);
        const secondNewOutput = runCode(secondNewCode, -1);
        const secondNewFitness = getFitness(secondNewOutput, correctOutput);

        population.push(
            {
                program: firstNewProgram,
                code: firstNewCode,
                fitness: firstNewFitness
            },
            {
                program: secondNewProgram,
                code: secondNewCode,
                fitness: secondNewFitness
            }
        );
    }

    sortPopulation(population);

    population.splice(POPULATION_SIZE);
}
