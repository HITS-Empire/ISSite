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
}

export { NeuralNetwork };
