import Canvas from "../../components/Canvas";
import { createCanvas } from "../../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../../components/Algorithms/Genetic/Basic/Menu";

export default function Genetic() {
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
        <>
            <Menu />

            <Canvas canvasRef={canvasRef} />
        </>
    );
}