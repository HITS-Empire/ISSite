const {
    NN,
    feedForward
} = require("../../../utils/neuralNetwork");

// Метод для распознавания цифры
export default function handler(request, response) {
    if (!request.body) {
        return response.status(200).send("ok");
    }

    const pixels = JSON.parse(request.body);
    const output = feedForward(NN, pixels);

    let endDigit = 0;
    let endDigitWeight = -1;

    for (let i = 0; i < 10; i++) {
        if (endDigitWeight < output[i]) {
            endDigitWeight = output[i];
            endDigit = i;
        }
    }

    response.status(200).send(endDigit);
}
