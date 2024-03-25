import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Clustering/Menu";
import Field from "../components/Algorithms/Clustering/Field";

export default function Clustering() {
    // Количество кластеров в kMeans и WARD
    const [clusters, setClusters] = useState(4);
    
    // Радиус поиска кластеров для DBSCAN
    const [radius, setRadius] = useState(128);

    // Количество точек в радиусе для DBSCAN
    const [minAmount, setMinAmount] = useState(1);
    
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
                clusters={clusters}
                setClusters={setClusters}
                radius={radius}
                setRadius={setRadius}
                minAmount={minAmount}
                setMinAmount={setMinAmount}
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
