import { useState } from "react";
import Canvas from "../../../Canvas";

export default function Field({
    canvasRef,
    canvas,
    ctx
}) {
    // Активно ли рисование
    const [processIsActive, setProcessIsActive] = useState(false);

    const isPainting = () => {
        setProcessIsActive(true);
    }

    const endPainting = () => {
        setProcessIsActive(false);
    }

    const painting = (e) => {
        if (!processIsActive) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const canvasX = x * (canvas.width / rect.width);
        const canvasY = y * (canvas.height / rect.height);
        
        ctx.fillStyle = "rgb(188, 136, 255, 0.07)"
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 3.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgb(188, 136, 255, 1)";
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 1.0, 0, Math.PI * 2);
        ctx.fill();
    }

    return (
        <Canvas
            canvasRef={canvasRef}
            onMouseDown={isPainting}
            onMouseMove={painting}
            onMouseUp={endPainting}
            onMouseOut={endPainting}
        />
    );
}