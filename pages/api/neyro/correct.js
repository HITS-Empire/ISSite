const {
    NN,
    saveToFile,
    backpropagation
} = require("../../../utils/neuralNetwork");

// Метод для исправления нейронов и весов
export default function handler(request, response) {
    if (!request.body) {
        return response.status(200).send("ok");
    }

    const correctDigit = Number(request.body);

    const targets = new Array(10).fill(0);
    targets[correctDigit] = 1;

    backpropagation(NN, targets);

    response.status(200).send("ok");

    saveToFile(NN, "weights");
    saveToFile(NN, "neurons");
    saveToFile(NN, "biases");
}
