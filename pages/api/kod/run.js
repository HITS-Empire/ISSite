import {
    runGenetic,
    getPopulation,
    getCorrectFibonacciOutput
} from "../../../utils/genetic";

// Алгоритмы, работающие сейчас
let algorithms = [];

// Корректный вывод программы
const correctOutput = getCorrectFibonacciOutput();

// Метод работы с генетикой
export default function handler(request, response) {
    if (!request.body) {
        return response.status(200).send("ok");
    }

    // Очистить забытые алгоритмы
    algorithms = algorithms.filter((item) => {
        return !item.time || item.time - Date.now() < 60 * 1000;
    });

    const id = request.body;

    let algorithm = algorithms.find((item) => id === item.id);

    // Создать новый алгоритм
    if (!algorithm) {
        algorithm = {
            id,
            population: getPopulation(correctOutput)
        }

        algorithms.push(algorithm);
    }

    algorithm.time = Date.now();

    runGenetic(algorithm.population, correctOutput);

    const { code, fitness } = algorithm.population[0];

    response.status(200).send({ id, code, fitness });
}
