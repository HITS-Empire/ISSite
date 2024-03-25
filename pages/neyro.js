import Canvas from "../components/Canvas";
import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/NeuralNetwork/Menu";
import PaintWindow from "../components/Algorithms/NeuralNetwork/PaintWindow";

export default function NeuralNetwork() {
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
            />

            <PaintWindow
                canvasRef={canvasRef}
                canvas={canvas}
                ctx={ctx}
            />
        </>
    );
}
