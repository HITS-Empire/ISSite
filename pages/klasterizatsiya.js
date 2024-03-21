import Canvas from "../components/Canvas";
import { createCanvas } from "../utils/canvas";
import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Clustering/Menu";

export default function Clustering() {
    // Статус поиска ("success" или "error")
    const [status, setStatus] = useState();
    
    // Активен ли процесс кластеризации
    const [processIsActive, setProcessIsActive] = useState(false);
    
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
            size: 3000
        });
    }, []);

    // Создание объекта нажатием мышки
    const setPoint = (e) => {        
        if (ctx) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    return (
        <>
            <Menu
                processIsActive={processIsActive}
                setProcessIsActive={setProcessIsActive}
                status={status}
            />

            <Canvas       
                canvasRef={canvasRef}
                onMouseDown={setPoint}
            />

            
        </>
    );
}
