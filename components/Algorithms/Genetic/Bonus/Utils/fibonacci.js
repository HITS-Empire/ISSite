import { 
    getRandomIndex, 
    getRandomElement
} from "../../../../../utils/helpers";
import { sleep } from "../../../../../utils/helpers";

// Выполнить код в изменённом контексте console.log
export function runCode(code, n) {
    const messages = [];
    const console = {};

    console.log = (message) => messages.push(message);

    try {
        eval(code);
    } catch (error) {
        messages.push(error.message);
    }

    return messages;
};

// Получить начальную программу
export function getInitProgram() {
    return [
        {
            type: "basic",
            lines: [
                ["let", "i", "=", "0"],
                ["let", "a", "=", "1"],
                ["let", "b", "=", "1"],
                ["let", "c"]
            ]
        },
        {
            type: "condition",
            lines: [
                ["i", "<", "n", "-", "2"]
            ]
        },
        {
            type: "body",
            lines: [
                ["c", "=", "a", "+", "b"],
                ["a", "=", "b"],
                ["b", "=", "c"],
                ["i", "+=", "1"]
            ]
        },
        {
            type: "console",
            lines: [
                ["b"]
            ]
        }
    ];
};

// Получить линии программы по типу
export function getLinesFromType(program, type) {
    return program.find((part) => part.type === type).lines.map((line) => line.join(" "));
}

// Получить код по структуре программы
export function getCodeFromProgram(program) {
    const lines = [
        getLinesFromType(program, "basic"),
        [
            `while (${getLinesFromType(program, "condition").join(" ")}) {`,
            ...getLinesFromType(program, "body").map((line) => "    " + line),
            "}"
        ],
        [
            `console.log(${getLinesFromType(program, "console").join(" ")})`
        ]
    ];

    return lines.map((line) => line.join("\n")).join("\n\n");
}

export function getRatio(firstOutput, secondOutput) {
    if (typeof firstOutput[0] !== "string") {
        return firstOutput[0] / secondOutput;
    } else {
        return -1;
    }
}

export function mutation(population, index) {
    const types = ["basic", "condition", "body", "console"];

    const individual = population[index].program;

    const mutationRate = 0.01;

    let firstType = getRandomElement(types);
    let secondType = getRandomElement(types);

    const firstLine = getRandomElement(individual.find((part) => part.type === firstType).lines);
    const secondLine = getRandomElement(individual.find((part) => part.type === secondType).lines);
    
    let i = 0;
    let j = 0;

    for (let j = 0; j < 16; j++) {
        if (mutationRate > Math.random()) {
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
}



export async function fibonacci({ setCode, output, setPopulation, population }) {
    if (population.length == 0) return;

    for (let i = 0; i < population.length; i++) {
        
    }
    
    
    await sleep(200);

    setCode(getCodeFromProgram(population[Math.floor(Math.random() * population.length)].program));
}
