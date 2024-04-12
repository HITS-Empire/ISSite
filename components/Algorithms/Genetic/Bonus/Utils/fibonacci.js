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
    "=", 6, 
    "b", 5, 
    "let", 4, 
    "a", 3, 
    "c", 3, 
    "i", 3, 
    "1", 3
];

const allGens = [
    "=", 
    "let",
    "b",
    "i",
    "a",
    "c",
    "1",
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
    let k = 0;

    const breakPointIndex = getRandomIndex(newIndLine);

    //console.log(newInd, usedGens, breakPointIndex, newIndLineIndex, type);

    for (let i = 0; i < types.length; i++) {
        if (types[i] === type) {
            
            const firstIndLines = firstInd.find((part) => part.type === type).lines;

            while (k < firstIndLines.length) {
                if (k === newIndLineIndex) {
                    for (let j = 0; j < breakPointIndex; j++) {
                        const newGen = firstIndLines[k][j];
                        newIndLine[j] = newGen;
                        usedGens.push(newGen);
                    }


                    break;
                } else {
                    const newIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
                    const newLine = firstInd.find((part) => part.type === types[i]).lines[k];
                    newInd[newIndPartIndex].lines[k] = newLine;

                    for (let j = 0; j < newLine.length; j++) {
                        const newGen = firstInd.find((part) => part.type === type).lines[k][j];
                        usedGens.push(newGen);
                    }
                }

                k++;
            }
            index = i;
            if (k === newIndLineIndex) break;
        } else {
            const newIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
            const newLines = firstInd.find((part) => part.type === types[i]).lines;
            newInd[newIndPartIndex].lines = newLines.map((line) => [...line]);

            for (const newLine of newLines) {
                for (let k = 0; k < newLine.length; k++) {
                    usedGens.push(newLine[k]);
                }
            }
        }
    }
    
    for (let i = index; i < types.length; i++) {
        if (types[i] === type) {
            const secondIndLines = secondInd.find((part) => part.type === type).lines;

            while (k < secondIndLines.length) {
                if (k === newIndLineIndex) {
                    
                    for (let j = breakPointIndex; j < secondIndLines[k].length; j++) {
                        const newGen = secondIndLines[k][j];
                        
                        if (!usedGens.includes(newGen) || (usedGens.includes(newGen) && repetitiveGens.includes(newGen) && usedGens.filter((gen) => gen === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1])) {
                            newIndLine[j] = newGen;
                            usedGens.push(newGen);
                        } else {
                            newIndLine[j] = "skipped";
                        }
                    }
                    
                } else {
                    const newIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
                    const newLine = secondInd.find((part) => part.type === types[i]).lines[k];

                    for (let j = 0; j < newLine.length; j++) {
                        const newGen = newLine[j];
                        if (!usedGens.includes(newGen) || (usedGens.includes(newGen) && repetitiveGens.includes(newGen) && usedGens.filter((gen) => gen === newGen).length < repetitiveGens[repetitiveGens.indexOf(newGen) + 1])) {
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
            const newIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
            const newLines = secondInd.find((part) => part.type === types[i]).lines;
            
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

    for (let i = 0; i < types.length; i++) {
        const newLines = newInd.find((part) => part.type === types[i]).lines;
        const newNewIndPartIndex = newInd.findIndex((part) => part.type === types[i]);
        
        for (let j = 0; j < newLines.length; j++) {
            const newLine = newLines[j];
            
            for (let h = 0; h < newLine.length; h++) {
                if (newLine[h] === "skipped") {

                    for (let g = 0; g < allGens.length; g++) {
                        if (!usedGens.includes(allGens[g]) || usedGens.includes(allGens[g]) && repetitiveGens.includes(allGens[g]) && usedGens.filter((gen) => gen === allGens[g]).length < repetitiveGens[repetitiveGens.indexOf(allGens[g]) + 1]) {
                            newLine[h] = allGens[g];
                            usedGens.push(allGens[g]);
                            break;
                        }
                    }
                }
            }

            newInd[newNewIndPartIndex].lines[j] = newLine;
        }
    }
    console.log(newInd, usedGens);
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
