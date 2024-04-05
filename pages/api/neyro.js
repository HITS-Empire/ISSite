import fs from "fs";

// Путь до файлов нейросети
const path = "./neuro/dist";

// Перезаписать слои нейросети
function saveToFile(NN, attribute) {
    const array = NN.layers.map((layer) => layer[attribute]);
    const jsonArray = JSON.stringify(array);

    fs.writeFileSync(`${path}/${attribute}.json`, jsonArray);
}

// Метод для исправления нейронов и весов
export default function handler(request, response) {
    const NN = JSON.parse(request.body);

    saveToFile(NN, "weights");
    saveToFile(NN, "neurons");
    saveToFile(NN, "biases");

    response.status(200).send("ok");
}

// Нужно для корректной работы API
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "1gb"
        }
    }
};
