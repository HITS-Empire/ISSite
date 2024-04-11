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

export function getRandomIndividual() {
    const individual = getInitProgram();

    const types = ["basic", "condition", "body", "console"];

    for (let i = 0; i < 128; i++) {
        const firstType = getRandomElement(types);
        const secondType = getRandomElement(types);

        const firstLine = getRandomElement(individual.find((part) => part.type === firstType).lines);
        const secondLine = getRandomElement(individual.find((part) => part.type === secondType).lines);

        for (let j = 0; j < 4; j++) {
            const firstIndex = getRandomIndex(firstLine);
            const secondIndex = getRandomIndex(secondLine);

            const temp = firstLine[firstIndex];
            firstLine[firstIndex] = secondLine[secondIndex];
            secondLine[secondIndex] = temp;
        }
    }

    return individual;
};

export function getRatio(firstOutput, secondOutput) {
    if (typeof firstOutput[0] !== "string") {
        return firstOutput[0] / secondOutput;
    } else {
        return -1;
    }
}

const types = ["basic", "condition", "body", "console"];
const mutationRate = 0.01;

export function mutation(ind) {
    const newInd = ind;

    for (let j = 0; j < 16; j++) {
        if (mutationRate > Math.random()) {
            let firstType = getRandomElement(types);
            let secondType = getRandomElement(types);

            const firstLine = getRandomElement(newInd.find((part) => part.type === firstType).lines);
            const secondLine = getRandomElement(newInd.find((part) => part.type === secondType).lines);

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

    return newInd;
}

const repetitiveGens = [
    "let", 4, 
    "a", 3, 
    "=", 6, 
    "b", 5, 
    "c", 3, 
    "i", 3, 
    "1", 3
];

const allGens = [
    "=", "=", "=", "=", "=", "=",
    "let", "let", "let", "let",
    "b", "b", "b", "b", "b",
    "i", "i", "i",
    "a", "a", "a",
    "c", "c", "c",
    "1", "1", "1",
    "0",
    "n",
    "<",
    "-",
    "2",
    "+="
]

export function crossover(firstInd, secondInd) {
    const type = getRandomElement(types);

    const newInd = getRandomIndividual();

    const newIndLineIndex = getRandomIndex(newInd.find((part) => part.type === type).lines);
    const newIndLine = newInd.find((part) => part.type === type).lines[newIndLineIndex];

    const usedGens = [];
    let index;
    
    const firstLine = getRandomElement(firstInd.find((part) => part.type === type).lines);
    const lineIndex = getRandomIndex(firstInd.find((part) => part.type === type).lines);

    const breakPointIndex = getRandomIndex(newIndLine);

    for (let i = 0; i < types.length; i++) {
        if (types[i] === type) {
            
            const firstIndLines = firstInd.find((part) => part.type === type).lines;
            let k = 0;

            while (k < firstIndLines.length) {
                if (k === newIndLineIndex) {
                    
                    for (let j = 0; j < breakPointIndex; j++) {
                        const newGen = secondInd.find((part) => part.type === type).lines[k][j];
                        
                        if (!usedGens.includes(newGen) || usedGens.includes(newGen) && repetitiveGens.includes(newGen) && usedGens.filter((gen) => gen === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1] ) {
                            newIndLine[j] = newGen;
                            usedGens.push(newIndLine[j]);
                        } else {
                            newIndLine[j] = "skipped";
                        }
                    }
                    break;
                } else {
                    const newIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
                    const newLine = firstInd.find((part) => part.type === types[i]).lines[k];
                    newInd[newIndPartIndex].lines[k] = newLine;

                    for (let j = 0; j < newLine.length; j++) {
                        const newGen = secondInd.find((part) => part.type === type).lines[k][j];
                        if (!usedGens.includes(newGen) || usedGens.includes(newGen) && repetitiveGens.includes(newGen) && usedGens.filter((gen) => gen === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1] ) {
                            usedGens.push(newIndLine[j]);
                        }
                    }
                }

                k++;
            }

            if (k === newIndLine) break;
        } else {
            const newIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
            const newLines = firstInd.find((part) => part.type === types[i]).lines;
            newInd[newIndPartIndex].lines = newLines.map((line) => [...line]);

            const usedLines = firstInd.find((part) => part.type === types[i]).lines;
            for (const usedLine of usedLines) {
                for (let k = 0; k < usedLine.length; k++) {
                    if (!usedGens.includes(usedLine[k])) {
                        usedGens.push(usedLine[k]);
                    } else {
                        if (repetitiveGens.includes(usedLine[k]) && usedGens.filter((gen) => gen === usedLine[k]).length < repetitiveGens[repetitiveGens.indexOf(usedLine[k]) + 1]) {
                            usedGens.push(usedLine[k]);
                        }
                    }
                }
            }
        }
        index++;
    }

    const secondLine = getRandomElement(secondInd.find((part) => part.type === type).lines);

    for (let i = index; i < types.length; i++) {
        if (types[i] === type) {
            for (let j = breakPointIndex; j < secondLine.length; j++) {
                const newGen = secondInd.find((part) => part.type === type).lines[j];

                if (!usedGens.includes(newGen)) {        
                    newIndLine[j] = newGen;
                    usedGens.push(newIndLine[j]);
                } else {
                    if (repetitiveGens.includes(newGen)) {
                        if (usedGens.filter((element) => element === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1]) {
                            newIndLine[j] = newGen;
                            usedGens.push(newIndLine[j]);
                        } else {
                            newIndLine[j] = "skipped";
                        }
                    } else {
                        newIndLine[j] = "skipped";
                    }
                }
            }
        } else {
            const newIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
            const newLines = firstInd.find((part) => part.type === types[i]).lines;
            newInd[newIndPartIndex].lines = newLines.map((line) => [...line]);
        }
    }

    for (let i = 0; i < newIndLine.length; i++) {
        if (newIndLine[i] === "skipped") {
            for (let j = 0; j < allGens.length; j++) {
                if (!usedGens.includes(allGens[j]) || usedGens.includes(allGens[j]) && repetitiveGens.includes(allGens[j]) && usedGens.filter((gen) => gen === allGens[j]).length < repetitiveGens[repetitiveGens.indexOf(allGens[j]) + 1]) {
                    newIndLine[i] = allGens[j];
                }
            }
        }
    }

    return newInd;
}

export async function fibonacci({ setCode, output, setPopulation, population, number }) {
    if (population.length == 0) return;

    const newPopulation = [];

    for (let i = 0; i < population.length / 2; i++) {
        const firstInd = getRandomElement(population).program;
        const secondInd = getRandomElement(population).program;

        const firstNewInd = crossover(firstInd, secondInd);
        const secondNewInd = crossover(secondInd, firstInd);

        const mutatedFirstNewInd = mutation(firstNewInd);
        const mutatedSecondNewInd = mutation(secondNewInd);
        const codeOfMutatedFirstNewInd = getCodeFromProgram(mutatedFirstNewInd);
        const codeOfMutatedSecondNewInd = getCodeFromProgram(mutatedSecondNewInd);
        const outputOfMutatedFirstNewInd = runCode(codeOfMutatedFirstNewInd, number);
        const outputOfMutatedSecondNewInd = runCode(codeOfMutatedSecondNewInd, number);
        const ratioOfMutatedFirstNewInd = getRatio(outputOfMutatedFirstNewInd, output);
        const ratioOfMutatedSecondNewInd = getRatio(outputOfMutatedSecondNewInd, output);

        newPopulation.push({program: mutatedFirstNewInd, code: codeOfMutatedFirstNewInd, ratio: ratioOfMutatedFirstNewInd});
        newPopulation.push({program: mutatedSecondNewInd, code: codeOfMutatedSecondNewInd, ratio: ratioOfMutatedSecondNewInd});
    }
    newPopulation.sort((a, b) => {
        return Math.abs(1 - b.ratio) - Math.abs(1 - a.ratio)}
    );
    
    await sleep(200);

    setPopulation(newPopulation);
    setCode(newPopulation[0].code);
}
