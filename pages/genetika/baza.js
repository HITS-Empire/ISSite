import { createCanvas } from "../../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../../components/Algorithms/Genetic/Basic/Menu";
import Field from "../../components/Algorithms/Genetic/Basic/Field";

export default function Genetic() {
    // Вершины графа
    const [vertices, setVertices] = useState([]);
    const [lines, setLines] = useState([]);

    // Количество популяций
    const [maxAmountOfPopulations, setMaxAmountOfPopulations] = useState(50);

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
                setVertices={setVertices}
                vertices={vertices}
                maxAmountOfPopulations={maxAmountOfPopulations}
                setMaxAmountOfPopulations={setMaxAmountOfPopulations}
                setLines={setLines}
                canvas={canvas}
                ctx={ctx}
            />

            <Field
                vertices={vertices}
                setVertices={setVertices}
                lines={lines}
                setLines={setLines}
                canvasRef={canvasRef}
                canvas={canvas}
                ctx={ctx}
            />
        </>
    );
}
