// Функции для нахождения производных
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const dsigmoid = (y) => y * (1 - y);

// Получить нейросеть
export function getNeuralNetwork(learningRate, ...sizes) {
    const weights = require("/neuro/out/weights.json");
    const biases = require("/neuro/out/biases.json");

    const layers = sizes.map((size, i) => {
        const nextLayerSize = i < sizes.length - 1 ? sizes[i + 1] : 0;

        return {
            size,
            neurons: new Array(size).fill(0),
            biases: new Array(size).fill(0),
            weights: new Array(size).fill(0).map(() => new Array(nextLayerSize).fill(0))
        };
    });

    layers.forEach((layer, index) => {
        layer.weights = weights[index];
        layer.biases = biases[index];
    });

    return {
        learningRate,
        layers
    };
}

// Обучение нейросети на основе алгоритма обратной ошибки
export function backpropagation(NN, targets) {
    let errors = new Array(NN.layers[NN.layers.length - 1].size);

    for (let i = 0; i < NN.layers[NN.layers.length - 1].size; i++) {
        errors[i] = targets[i] - NN.layers[NN.layers.length - 1].neurons[i];
    }
    
    for (let k = NN.layers.length - 2; k >= 0; k--) {
        let l = NN.layers[k];
        let l1 = NN.layers[k + 1];

        let errorsNext = new Array(l.size).fill(0);
        let gradients = new Array(l1.size).fill(0);
        
        for (let i = 0; i < l1.size; i++) {
            gradients[i] = errors[i] * dsigmoid(NN.layers[k + 1].neurons[i]);
            gradients[i] *= NN.learningRate;
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
        NN.layers[k] = l;
    }
}

// Прямой просмотр нейронов
export function feedForward(NN, inputs) {
    NN.layers[0].neurons = [...inputs];

    for (let i = 1; i < NN.layers.length; i++) {
        let l = NN.layers[i - 1];
        let l1 = NN.layers[i];

        for (let j = 0; j < l1.size; j++) {
            l1.neurons[j] = 0;
            
            for (let k = 0; k < l.size; k++) {
                l1.neurons[j] += l.neurons[k] * l.weights[k][j];
            }
            
            l1.neurons[j] += l1.biases[j];
            l1.neurons[j] = sigmoid(l1.neurons[j]);
        }
    }
    
    return NN.layers[NN.layers.length - 1].neurons;
}
