import Canvas from "../components/Canvas";
import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";

export default function Ant() {
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
            size: 1000
        });
    }, []);

    return (
        <Canvas canvasRef={canvasRef} />
    );
}
