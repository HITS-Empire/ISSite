import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/NeuralNetwork/Menu";
import Field from "../components/Algorithms/NeuralNetwork/Field";

// Скомпилировано ли API
let apiIsCompiled = false;

export default function NeuralNetwork() {
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

    // Создать Canvas'ы и скомпилировать нейросеть
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

        // Скомпилировать API холостыми вызовами
        if (!apiIsCompiled) {
            fetch("/api/neyro/correct");
            fetch("/api/neyro/predict");

            apiIsCompiled = true;
        }
    }, []);

    return (
        <>
            <Menu
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
