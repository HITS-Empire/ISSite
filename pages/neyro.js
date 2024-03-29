import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Neuro/Menu";
import Field from "../components/Algorithms/Neuro/Field";
import { NeuralNetwork } from "../components/Algorithms/Neuro/Utils/NeuralNetwork";

export default function Neuro() {
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    const dsigmoid = (y) => y * (1 - y);

    // Создать нейросеть
    const NN = new NeuralNetwork(0.01, sigmoid, dsigmoid, 2500, 1000, 200, 10);

    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

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
            />

            <Field
                canvasRef={canvasRef}
                canvas={canvas}
                ctx={ctx}
            />
        </>
    );
}
