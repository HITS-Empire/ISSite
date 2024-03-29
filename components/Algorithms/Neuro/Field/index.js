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
        ctx.beginPath();
    }

    const painting = (e) => {
        if (!processIsActive) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const canvasX = x * (canvas.width / rect.width);
        const canvasY = y * (canvas.height / rect.height);

        ctx.lineWidth = 1;
        ctx.liceCap = "round";
        ctx.strokeStyle = "#bc88ff";

        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(canvasX, canvasY);
    }

    return (
        <Canvas
            canvasRef={canvasRef}
            onMouseDown={isPainting}
            onMouseMove={painting}
            onMouseUp={endPainting}
        />
    );
}