import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Genetic/Basic/Menu";
import Field from "../components/Algorithms/Genetic/Basic/Field";
import { pathOfTravelingSalesman, randomPath } from "../components/Algorithms/Genetic/Basic/Utils/pathOfTravelingSalesman";

export default function BasicGenetic() {
    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Вершины графа
    const [vertices, setVertices] = useState([]);
    const [lines, setLines] = useState([]);

    // Завершить повторения циклов, если нажата кнопка
    const [stop, setStop] = useState();

    // Популяция путей коммивояжера
    const [population, setPopulation] = useState([]);

    // Лучший путь
    const [bestPath, setBestPath] = useState([]);
    const [bestFintness, setBestFitness] = useState(0);

    useEffect(() => {
        if (vertices.length === 0 || stop) return;
        let newPopulation = Array.from({ length: 200 }, () =>
            randomPath(vertices.length)
        );

        setPopulation(newPopulation);   
    }, [stop]);

    useEffect(() => {
        if (!ctx || vertices.length === 0 || population.length === 0) return;

        if (stop) {
            ctx.beginPath();
            ctx.moveTo(vertices[bestPath[0] - 1].x, vertices[bestPath[0] - 1].y);
            ctx.strokeStyle = 'red';
        
            for (let i = 0; i < bestPath.length; i++) {
                ctx.lineTo(vertices[bestPath[i] - 1].x, vertices[bestPath[i] - 1].y);
            }
        
            ctx.closePath();
            ctx.stroke();
            
            return;
        }

        pathOfTravelingSalesman(
            setBestFitness,
            setPopulation,
            bestFintness,
            setBestPath,
            population,
            bestPath, 
            vertices,
            ctx, 
        );

    }, [population, stop]);

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
                setPopulation={setPopulation}
                setVertices={setVertices}
                setStop={setStop}
                vertices={vertices}
                setLines={setLines}
                canvas={canvas}
                stop={stop}
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
