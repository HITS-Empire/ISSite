import { useState } from "react";
import Canvas from "../../../Canvas";
import style from "./style.module.scss";

export default function Field({
    canvasRef,
    hiddenCanvasRef,
    canvas,
    ctx,
    setCondition,
    setCorrectDigit,
    setIsFixed
}) {
    // Активно ли рисование
    const [processIsActive, setProcessIsActive] = useState(false);

    const isPainting = () => {
        setCondition(false);
        setCorrectDigit(0);
        setIsFixed(0);
        setProcessIsActive(true);
    };

    const endPainting = () => {
        setProcessIsActive(false);
    };

    const drawCircle = (x, y, radius, opacity) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    };

    const painting = (e) => {
        if (!processIsActive) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const canvasX = x * (canvas.width / rect.width);
        const canvasY = y * (canvas.height / rect.height);

        drawCircle(canvasX, canvasY, 3, 0.01);
        drawCircle(canvasX, canvasY, 2, 0.05);
        drawCircle(canvasX, canvasY, 1, 0.5);
    };

    return (
        <>
            <Canvas
                className={style.hiddenCanvas}
                canvasRef={hiddenCanvasRef}
            />
            <Canvas
                canvasRef={canvasRef}
                onMouseDown={isPainting}
                onMouseMove={painting}
                onMouseUp={endPainting}
                onMouseOut={endPainting}
            />
        </>
    );
}