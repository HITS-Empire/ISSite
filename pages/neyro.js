import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Neuro/Menu";
import Field from "../components/Algorithms/Neuro/Field";

// Создать слои нейронной сети
function createLayer(size, nextLayerSize) {
    return {
        size: size,
        neurons: new Array(size).fill(0),
        biases: new Array(size).fill(0),
        weights: new Array(size).fill(0).map(() => new Array(nextLayerSize).fill(0))
    };
}

// Создать нейронную сеть
function createNeuralNetwork(learningRate, ...sizes) {
    const layers = sizes.map((size, i) => {
        let nextLayerSize = i < sizes.length - 1 ? sizes[i + 1] : 0;
        return createLayer(size, nextLayerSize);
    });

    return {
        learningRate: learningRate,
        layers: layers
    };
}

export async function getStaticProps() {
    const newWeights = require("/neuro/out/weights.json");
    const newBiases = require("/neuro/out/biases.json");

    let NN = createNeuralNetwork(0.01, 2500, 1000, 200, 10);

    NN.layers.forEach((layer, index) => {
        layer.weights = newWeights[index];
        layer.biases = newBiases[index];
    });

    return {
        props: {
            NN,
        },
    };
}   

export default function Neuro({NN}) {
    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Правильная цифра, в случае если нейросеть не распознала цифру
    const [correctDigit, setCorrectDigit] = useState();

    // Создать Canvas
    useEffect(() => {
        createCanvas({
            canvasRef,
            setCanvas,
            setCtx,
            size: 50
        });
    }, []);

    return (
        <>
            <Menu 
                canvas={canvas}
                ctx={ctx}
                NN={NN}
                correctDigit={correctDigit}
                setCorrectDigit={setCorrectDigit}
            />

            <Field
                canvasRef={canvasRef}
                canvas={canvas}
                ctx={ctx}
            />
        </>
    );
}
