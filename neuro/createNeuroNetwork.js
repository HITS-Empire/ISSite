// Слои нейронной сети
class Layer {
    constructor(size, nextSize) {
        this.size = size;
        this.neurons = new Array(size).fill(0);
        this.biases = new Array(size).fill(0);
        this.weights = new Array(size).fill(0).map(() => new Array(nextSize).fill(0));
    }
}

// Нейронная сеть
class NeuralNetwork {
    constructor(learningRate, activation, derivative, ...sizes) {
        this.learningRate = learningRate;
        this.activation = activation;
        this.derivative = derivative;
        this.layers = [];
        
        sizes.forEach((size, i) => {
            let nextSize = i < sizes.length - 1 ? sizes[i + 1] : 0;
            this.layers.push(new Layer(size, nextSize));
            
            this.layers[i].biases = this.layers[i].biases.map(() => Math.random() * 2.0 - 1.0);
            this.layers[i].weights = this.layers[i].weights.map(() => new Array(nextSize).fill(0).map(() => Math.random() * 2.0 - 1.0));
        });
    }

    // Функция для прямого алгоритма    
    feedForward(inputs) {
        inputs.forEach((input, index) => this.layers[0].neurons[index] = input ? 1 : 0);
        
        for (let i = 1; i < this.layers.length; i++) {
            let l = this.layers[i - 1];
            let l1 = this.layers[i];
            
            for (let j = 0; j < l1.size; j++) {
                l1.neurons[j] = 0;
                
                for (let k = 0; k < l.size; k++) {
                    l1.neurons[j] += l.neurons[k] * l.weights[k][j];
                }
                
                l1.neurons[j] += l1.biases[j];
                l1.neurons[j] = this.activation(l1.neurons[j]);
            }
        }
        
        return this.layers[this.layers.length - 1].neurons;
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

            let gradients = new Array(l1.size).fill(0);
            
            for (let i = 0; i < l1.size; i++) {
                gradients[i] = errors[i] * this.derivative(this.layers[k + 1].neurons[i]) * this.learningRate;
            }
            
            let deltas = new Array(l1.size).fill(0).map(() => new Array(l.size).fill(0));
            
            for (let i = 0; i < l1.size; i++) {
                for (let j = 0; j < l.size; j++) {
                    deltas[i][j] = gradients[i] * l.neurons[j];
                }
            }
            
            let errorsNew = new Array(l.size).fill(0);
            
            for (let i = 0; i < l.size; i++) {
                for (let j = 0; j < l1.size; j++) {
                    errorsNew[i] += l.weights[i][j] * errors[j];
                }
            }
            
            errors = errorsNew;
            
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

    // Сохранить все веса нейронной сети в файл JSON
    saveWeightsToFile(filename) {
        const weightsToSave = this.layers.map(layer => layer.weights);
        const jsonWeights = JSON.stringify(weightsToSave);

        fs.writeFileSync(filename, jsonWeights);
    }

    saveNeuronsToFile(filename) {
        const neuronsToSave = this.layers.map(layer => layer.neurons);
        const jsonNeurons = JSON.stringify(neuronsToSave);

        fs.writeFileSync(filename, jsonNeurons);
    }

    saveBiasesToFile(filename) {
        const biasesToSave = this.layers.map(layer => layer.biases);
        const jsonBiases = JSON.stringify(biasesToSave);

        fs.writeFileSync(filename, jsonBiases);
    }
}

const fs = require("fs");
const sharp = require("sharp");

const path = "./neuro/images/50";
const size = 50 * 50;

// Получить массив чёрно-белых пикселей
const getImageData = async (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await sharp(path + "/" + file)
                .raw()
                .toBuffer({ resolveWithObject: true });

            const imageData = [];
            imageData.push(file);
            for (let i = 0; i < size; i += 3) {
                let value = 0;
                for (let j = 0; j < 3; j++) {
                    value += data[i + j];
                }
                value /= 3;
    
                // True - белый, False - чёрный
                imageData.push(value > 128);
            }

            resolve(imageData);
        } catch (error) {
            reject(error);
        }
    });
};

// Получить матрицу картинок с пикселями
const getImagesData = async () => {
    const files = fs.readdirSync(path);

    const imagesData = await Promise.all(
        files.map(getImageData)
    );

    return imagesData;
};

// Создание нейросети и обучение её
const learning = async () => {
    const imagesData = await getImagesData();

    const sigmoid = x => 1 / (1 + Math.exp(-x));
    const dsigmoid = y => y * (1 - y);

    const NN = new NeuralNetwork(0.001, sigmoid, dsigmoid, 2500, 512, 128, 32, 10);

    const digits = [];

    for (let i = 0; i < imagesData.length; i++) {
        digits.push(parseInt(imagesData[i][0][10]));
    }

    // Количество эпох обучения
    const epochs = 1000;

    for (let i = 0; i < epochs; i++) {
        let correct = 0;
        
        for (let j = 0; j < 100; j++) {
            let index = Math.floor(Math.random() * imagesData.length);

            const startDigit = digits[index];
            const targets = new Array(10).fill(0);
            targets[startDigit] = 1;

            const output = NN.feedForward(imagesData[index]);

            let endDigit = 0;
            let endDigitWeight = -1;
            for (let d = 0; d < 10; d++) {
                if (output[d] > endDigitWeight) {
                    endDigitWeight = output[d];
                    endDigit = d;
                }
            }

            if (startDigit === endDigit) {
                correct++;
            }

            NN.backpropagation(targets);
        }

        console.log(i);
        console.log(correct);
    }

    // Сохранить веса
    NN.saveWeightsToFile('./weights.json');

    // Сохранить нейроны 
    NN.saveNeuronsToFile('./neurons.json');
    
    // Сохранить биасы
    NN.saveBiasesToFile('./biases.json');
};

learning();