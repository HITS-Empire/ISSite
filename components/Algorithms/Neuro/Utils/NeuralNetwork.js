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

        const newWeights = require("/neuro/out/weights.json");
        const newBiases = require("/neuro/out/biases.json");

        sizes.forEach((size, i) => {
            let nextSize = i < sizes.length - 1 ? sizes[i + 1] : 0;
            this.layers.push(new Layer(size, nextSize));

            this.layers[i].weights = newWeights[i];
            
            this.layers[i].biases = newBiases[i];
        });
        
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
}

export { NeuralNetwork };
