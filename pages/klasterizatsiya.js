import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Clustering/Menu";
import Field from "../components/Algorithms/Clustering/Field";

export default function Clustering() {
    // Матрица для всех точек
    const [points, setPoints] = useState([]);

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
            <Menu
                points={points}
                setPoints={setPoints}
                canvas={canvas}
                ctx={ctx}
            />

            <Field
                points={points}
                setPoints={setPoints}
                canvasRef={canvasRef}
                canvas={canvas}
                ctx={ctx}
            />
        </>
    );
}
