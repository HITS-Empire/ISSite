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
    "let",
    "i",
    "=",
    "0",
    "a",
    "b",
    "c",
    "1",
    "n",
    "<",
    "-",
    "2",
    "+="
]

const crossover = (firstInd, secondInd) => {
    const type = getRandomElement(types);

    const newInd = getInitProgram();
    const newIndLine = getRandomElement(newInd.find((part) => part.type === type).lines);

    const usedGens = [];
    let index;
    
    const firstLine = getRandomElement(firstInd.find((part) => part.type === type).lines);
    const breakPointIndex = getRandomIndex(firstLine);

    for (let i = 0; i < types.length; i++) {
        if (types[i] === type) {
            for (let j = 0; j < breakPointIndex; j++) {
                newIndLine[j] = firstInd.find((part) => part.type === type).lines[j];
                usedGens.push(newIndLine[j]);
            }
            break;
        } else {
            let newIndPart = newInd.find((part) => part.type === types[i]);
            newIndPart = firstInd.find((part) => part.type === types[i]);

            const usedLines = firstInd.find((part) => part.type === types[i]).lines;
            for (let j = 0; j < usedLines.length; j++) {
                const usedLine = usedLines[j];

                for (let k = 0; k < usedLine.length; k++) {
                    usedGens.push(usedLine[k]);
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
                        if (usedGens.filter((element) => element === newGen).length !== repetitiveGens[repetitiveGens.indexOf(newGen) + 1]) {
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
            let newIndPart = newInd.find((part) => part.type === types[i]);
            newIndPart = secondInd.find((part) => part.type === types[i]);
        }
    }

    for (let i = 0; i < newIndLine.length; i++) {
        if (newIndLine[i] === "skipped") {
            for (let j = 0; j < allGens.length; j++) {
                if (!usedGens.includes(allGens)) {
                    newIndLine[i] = allGens;
                }
            }
        }
    }

    return newInd;
}

export async function fibonacci({ setCode, output, setPopulation, population, n}) {
    if (population.length == 0) return;

    const newPopulation = [];

    for (let i = 0; i < population.length; i++) {
        const firstInd = getRandomElement(population).program;
        const secondInd = getRandomElement(population).program;

        const firstNewInd = crossover(firstInd, secondInd);
        const secondNewInd = crossover(secondInd, firstInd);

        console.log(1)
        const mutatedFirstNewInd = mutation(firstNewInd);
        const mutatedSecondNewInd = mutation(secondNewInd);
        console.log(12)
        const codeOfMutatedFirstNewInd = getCodeFromProgram(mutatedFirstNewInd);
        const codeOfMutatedSecondNewInd = getCodeFromProgram(mutatedSecondNewInd);
        console.log(123)
        setCode(codeOfMutatedFirstNewInd);
        await sleep (500);
        const outputOfMutatedFirstNewInd = runCode(codeOfMutatedFirstNewInd, n)[0];
        const outputOfMutatedSecondNewInd = runCode(codeOfMutatedSecondNewInd, n)[0];
        console.log(1234) 
        const ratioOfMutatedFirstNewInd = getRatio(outputOfMutatedFirstNewInd, output);
        const ratioOfMutatedSecondNewInd = getRatio(outputOfMutatedSecondNewInd, output);

        console.log(12345)
        newPopulation.push({program: mutatedFirstNewInd, code: codeOfMutatedFirstNewInd, ratio: ratioOfMutatedFirstNewInd});
        newPopulation.push({program: mutatedSecondNewInd, code: codeOfMutatedSecondNewInd, ratio: ratioOfMutatedSecondNewInd});
    }
    console.log(123456)
    newPopulation.sort((a, b) => {
        return Math.abs(1 - b.ratio) - Math.abs(1 - a.ratio)}
    );
    console.log(1234567)
    setPopulation(newPopulation);
    
    await sleep(200);

    setCode(population[0]);
}
