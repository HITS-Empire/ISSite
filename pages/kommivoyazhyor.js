import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Genetic/Basic/Menu";
import Field from "../components/Algorithms/Genetic/Basic/Field";
import {
    randomPath,
    pathOfTravelingSalesman
} from "../components/Algorithms/Genetic/Basic/Utils/pathOfTravelingSalesman";

export default function BasicGenetic() {
    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Вершины графа
    const [vertices, setVertices] = useState([]);

    // Рёбра графа
    const [lines, setLines] = useState([]);

    // Статус программы (0 - не активно, 1 - выполняется поиск, 2 - поиск завершён)
    const [status, setStatus] = useState(0);

    // Перезагрузить поле
    const refreshField = () => {
        setVertices([]);
        setLines([]);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // Создать Canvas
    useEffect(() => {
        createCanvas({
            canvasRef,
            setCanvas,
            setCtx,
            size: 1000
        });
    }, []);

    // Запустить или остановить программу
    useEffect(() => {
        if (status === 0) refreshField();

        if (status === 1) {
            // Данные для работы алгоритма
            const data = {
                population: [],
                bestPath: [],
                bestFitness: 0,
                generation: 0
            };

            for (let i = 0; i < 512; i++) {
                data.population.push(randomPath(vertices.length));
            }

            const interval = setInterval(pathOfTravelingSalesman, 10, {
                data,
                canvas,
                ctx,
                vertices,
                lines,
                setStatus
            });

            return () => {
                clearInterval(interval);
            };
        }
    }, [status]);

    return (
        <>
            <Menu
                refreshField={refreshField}
                vertices={vertices}
                status={status}
                setStatus={setStatus}
            />

            <Field
                canvasRef={canvasRef}
                canvas={canvas}
                ctx={ctx}
                vertices={vertices}
                setVertices={setVertices}
                lines={lines}
                setLines={setLines}
                status={status}
            />
        </>
    );
}
