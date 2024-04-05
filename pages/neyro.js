import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/NeuralNetwork/Menu";
import Field from "../components/Algorithms/NeuralNetwork/Field";
import {
    getNeuralNetwork
} from "../components/Algorithms/NeuralNetwork/Utils/neuralNetwork";

// Создать нейросеть на этапе билда приложения
export const getStaticProps = () => {
    const NN = getNeuralNetwork(0.01, 2500, 1000, 200, 10);

    return {
        props: { NN }
    };
}

export default function NeuralNetwork({ NN }) {
    const canvasRef = useRef();
    const hiddenCanvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Состояния для работы со скрытым Canvas
    const [hiddenCanvas, setHiddenCanvas] = useState();
    const [hiddenCtx, setHiddenCtx] = useState();

    const [condition, setCondition] = useState(false);

    // Правильная цифра, в случае если нейросеть не распознала цифру
    const [correctDigit, setCorrectDigit] = useState(0);

    // Исправлена нейросеть или нет
    const [isFixed, setIsFixed] = useState(0);

    // Создать Canvas'ы
    useEffect(() => {
        createCanvas({
            canvasRef,
            setCanvas,
            setCtx,
            size: 50
        });

        createCanvas({
            canvasRef: hiddenCanvasRef,
            setCanvas: setHiddenCanvas,
            setCtx: setHiddenCtx,
            size: 50
        });
    }, []);

    return (
        <>
            <Menu
                NN={NN}
                canvas={canvas}
                ctx={ctx}
                hiddenCanvas={hiddenCanvas}
                hiddenCtx={hiddenCtx}
                condition={condition}
                setCondition={setCondition}
                correctDigit={correctDigit}
                setCorrectDigit={setCorrectDigit}
                isFixed={isFixed}
                setIsFixed={setIsFixed}
            />

            <Field
                canvasRef={canvasRef}
                hiddenCanvasRef={hiddenCanvasRef}
                canvas={canvas}
                ctx={ctx}
                setCondition={setCondition}
                setCorrectDigit={setCorrectDigit}
                setIsFixed={setIsFixed}
            />
        </>
    );
}
