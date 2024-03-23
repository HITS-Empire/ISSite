import style from "./style.module.scss";
import { useRef, useState, useEffect } from "react";
import { createCanvas } from "../../../../utils/canvas";
import Canvas from "../../../Canvas"
import { kMeans } from "../Utils/field";
import Button from "../../../Button";

export default function Field({
    processIsActive
}) {
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
    
    // Матрица для всех точек
    let points = [];

    // Обновить поле
    const refreshCanvas = () => {
        points = [];
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const setPoint = (e) => {
        if (ctx) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
    
            const canvasX = x * (canvas.width / rect.width);
            const canvasY = y * (canvas.height / rect.height);

            points.push({
                x: canvasX, 
                y: canvasY
            });

            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    // Раскрашивание кластеров
    const drawClusters = () => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33E6'];
        const clusters = kMeans(points);
        
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            clusters.forEach((cluster, index) => {
                ctx.fillStyle = colors[index];
                
                ctx.beginPath();
                ctx.arc(cluster.center.x, cluster.center.y, 10, 0, Math.PI * 2);
                ctx.fill();

                cluster.points.forEach(point => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                    ctx.fill();
                });
        
            });
        }
    }

    return (
        <>
        
            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={drawClusters}
                >
                    К - средних

                </Button>
            </div>

            <div>
                <Button
                    type="primary"
                    onClick={refreshCanvas}
                >
                    Обновить
                </Button>
            </div>
                
            <Canvas
                canvasRef={canvasRef}
                onMouseDown={setPoint}
            />
        </>
    );
}