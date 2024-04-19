const fs = require("fs");
const sharp = require("sharp");

// Получить массив чёрно-белых пикселей
const getImageData = async (path, size, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await sharp(path + "/" + file)
                .raw()
                .toBuffer({ resolveWithObject: true });

            const pixels = [];

            for (let i = 0; i < size * size * 3; i += 3) {
                let value = 0;
                for (let j = 0; j < 3; j++) {
                    value += data[i + j];
                }
                value /= 3;

                pixels.push(value / 255);
            }

            resolve({
                digit: Number(file[10]),
                pixels
            });
        } catch (error) {
            console.error("File: ", file);

            reject(error);
        }
    });
};

// Получить матрицу картинок с пикселями
const getImagesData = async (size) => {
    const path = "./neuro/images/" + size;

    const files = fs.readdirSync(path);

    const imagesData = await Promise.all(
        files.map((file) => getImageData(path, size, file))
    );

    return imagesData;
};

// Путь для сохранения нейросети
const path = "./neuro/out";

// Слои нейронной сети
class Layer {
    constructor(size, nextLayerSize) {
        this.size = size;
        this.neurons = new Array(size).fill(0);
        this.biases = new Array(size).fill(0);
        this.weights = new Array(size).fill(0).map(() => new Array(nextLayerSize).fill(0));
    }
}

// Нейронная сеть
class NeuralNetwork {
    constructor(learningRate, sigmoid, dsigmoid, ...sizes) {
        this.learningRate = learningRate;
        this.sigmoid = sigmoid;
        this.dsigmoid = dsigmoid;
        this.layers = [];

        const newWeights = require("./dist/weights.json");
        const newBiases = require("./dist/biases.json");
        
        sizes.forEach((size, i) => {
            let nextLayerSize = i < sizes.length - 1 ? sizes[i + 1] : 0;
            this.layers.push(new Layer(size, nextLayerSize));

            this.layers[i].weights = newWeights[i];
            this.layers[i].biases = newBiases[i];
        });
    }

    // Обучение нейросети на основе алгоритма обратной ошибки
    backpropagation(targets) {
        let errors = new Array(this.layers[this.layers.length - 1].size);

        for (let i = 0; i < this.layers[this.layers.length - 1].size; i++) {
            errors[i] = targets[i] - this.layers[this.layers.length - 1].neurons[i];
        }
        
        for (let k = this.layers.length - 2; k >= 0; k--) {
            let l = this.layers[k];
            let l1 = this.layers[k + 1];

            let errorsNext = new Array(l.size).fill(0);
            let gradients = new Array(l1.size).fill(0);
            
            for (let i = 0; i < l1.size; i++) {
                gradients[i] = errors[i] * this.dsigmoid(this.layers[k + 1].neurons[i]);
                gradients[i] *= this.learningRate;
            }
            
            let deltas = new Array(l1.size).fill(0).map(() => new Array(l.size).fill(0));
            
            for (let i = 0; i < l1.size; i++) {
                for (let j = 0; j < l.size; j++) {
                    deltas[i][j] = gradients[i] * l.neurons[j];
                }
            }
            for (let i = 0; i < l.size; i++) {
                for (let j = 0; j < l1.size; j++) {
                    errorsNext[i] += l.weights[i][j] * errors[j];
                }
            }
            
            errors = errorsNext;

            let weightsNew = new Array(l.weights.length).fill(0).map(() => new Array(l.weights[0].length).fill(0));
            
            for (let i = 0; i < l1.size; i++) {
                for (let j = 0; j < l.size; j++) {
                    weightsNew[j][i] = l.weights[j][i] + deltas[i][j];
                }
            }

            l.weights = weightsNew;
            
            for (let i = 0; i < l1.size; i++) {
                l1.biases[i] += gradients[i];
            }
        }
    }

    // Функция для прямого алгоритма    
    feedForward(inputs) {
        this.layers[0].neurons = [...inputs];

        for (let i = 1; i < this.layers.length; i++) {
            let l = this.layers[i - 1];
            let l1 = this.layers[i];

            for (let j = 0; j < l1.size; j++) {
                l1.neurons[j] = 0;
                
                for (let k = 0; k < l.size; k++) {
                    l1.neurons[j] += l.neurons[k] * l.weights[k][j];
                }
                
                l1.neurons[j] += l1.biases[j];
                l1.neurons[j] = this.sigmoid(l1.neurons[j]);
            }
        }
        
        return this.layers[this.layers.length - 1].neurons;
    }

    // Сохранить все веса нейронной сети в файл JSON
    saveWeightsToFile(file) {
        const weightsToSave = this.layers.map((layer) => layer.weights);
        const jsonWeights = JSON.stringify(weightsToSave);

        fs.writeFileSync(path + "/" + file, jsonWeights);
    }

    saveNeuronsToFile(file) {
        const neuronsToSave = this.layers.map((layer) => layer.neurons);
        const jsonNeurons = JSON.stringify(neuronsToSave);

        fs.writeFileSync(path + "/" + file, jsonNeurons);
    }

    saveBiasesToFile(file) {
        const biasesToSave = this.layers.map((layer) => layer.biases);
        const jsonBiases = JSON.stringify(biasesToSave);

        fs.writeFileSync(path + "/" + file, jsonBiases);
    }
}

// Обучить нейросеть по эпохам
const goThroughEpochs = (NN, imagesData, digits, epochs) => {
    for (let i = 0; i < epochs; i++) {
        let correct = 0;

        for (let j = i * 100; j < i * 100 + 100; j++) {
            const startDigit = digits[j];
            const targets = new Array(10).fill(0);
            targets[startDigit] = 1;

            const output = NN.feedForward(imagesData[j].pixels);

            let endDigit = 0;
            let endDigitWeight = -1;
            for (let d = 0; d < 10; d++) {
                if (endDigitWeight < output[d]) {
                    endDigitWeight = output[d];
                    endDigit = d;
                }
            }

            if (startDigit === endDigit) {
                correct++;
            }

            NN.backpropagation(targets);
        }
    }
};

// Создание нейросети и обучение её
const learning = async () => {
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    const dsigmoid = (y) => y * (1 - y);

    const NN = new NeuralNetwork(0.01, sigmoid, dsigmoid, 2500, 1000, 200, 10);

    const imagesData = await getImagesData(50);

    const digits = imagesData.map((imageData) => imageData.digit);

    const epochs = 600; // Количество эпох обучения

    goThroughEpochs(NN, imagesData, digits, epochs);
    goThroughEpochs(NN, imagesData, digits, epochs);

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    // Сохранить веса
    NN.saveWeightsToFile("weights.json");

    // Сохранить нейроны 
    NN.saveNeuronsToFile("neurons.json");

    // Сохранить биасы
    NN.saveBiasesToFile("biases.json");
};

learning();
