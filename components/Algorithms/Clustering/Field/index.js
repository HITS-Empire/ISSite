import style from "./style.module.scss";
import { useRef, useState, useEffect } from "react";
import { createCanvas } from "../../../../utils/canvas";
import { kMeans } from "../Utils/kmeans";
import { DBSCAN } from "../Utils/DBSCAN";
import { WARD } from "../Utils/WARD";
import Canvas from "../../../Canvas";
import Button from "../../../Button";
import MenuWrapper from "../../../MenuWrapper";

export default function Field() {
    const canvasRef = useRef();
    
    const [processIsActive, setProcessIsActive] = useState(false);

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
    const drawClusters = (condition) => {
        setProcessIsActive(true);
        //const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33E6', '#FF0000', '#008000'];
        const letters = '0123456789ABCDEF';
        
        let clusters;
        
        if (condition === 'kMeans') {
            clusters = kMeans(points);
        }
        if (condition === 'DBSCAN') {
            clusters = DBSCAN(points);
        }
        if (condition === 'WARD') {
            clusters = WARD(points);
        }

        if (ctx) {

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            clusters.forEach((cluster, index) => {
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }

                //ctx.fillStyle = colors[index];
                ctx.fillStyle = color;
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
            <MenuWrapper
                title="Алгоритм кластеризации"
                description="Сейчас вы узрите, как работает алгоритм кластеризации."
            >
                <div className={style.buttonContainer}>
                    <Button
                        type="primary"
                        onClick={() => drawClusters('kMeans')}
                        
                    >
                        К - средних

                    </Button>
                    <Button
                        type="primary"
                        onClick={() => drawClusters('DBSCAN')}
                    >
                        DBSCAN
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => drawClusters('WARD')}
                    >
                        WARD
                    </Button>
                </div>

                <div>
                    <Button
                        type="soft"
                        onClick={refreshCanvas}
                    >
                        Обновить
                    </Button>
                </div>
            </MenuWrapper>

            <Canvas
                canvasRef={canvasRef}
                onMouseDown={setPoint}
            />
        </>
    );
}