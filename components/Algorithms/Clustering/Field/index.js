import style from "./style.module.scss";
import { useRef, useState, useEffect } from "react";
import { createCanvas } from "../../../../utils/canvas";
import Canvas from "../../../Canvas"

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

    const setPoint = (e) => {
        if (ctx) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
    
            const canvasX = x * (canvas.width / rect.width);
            const canvasY = y * (canvas.height / rect.height);
    
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    return (
        <Canvas
            canvasRef={canvasRef}
            onMouseDown={setPoint}
        />
    );
}