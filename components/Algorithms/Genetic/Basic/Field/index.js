import { useEffect } from "react";
import Canvas from "../../../../Canvas";

export default function Field({
    canvasRef,
    canvas,
    ctx,
    vertices,
    setVertices,
    lines,
    setLines,
    status
}) {    
    const setVertex = (event) => {
        const rect = event.target.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const canvasX = x * (canvas.width / rect.width);
        const canvasY = y * (canvas.height / rect.height);

        setVertices([...vertices, { x: canvasX, y: canvasY }]);

        setLines((prevLines) => {
            const newLines = [...prevLines];

            for (let i = 0; i < vertices.length; i++) {
                newLines.push({ from: vertices[i], to: { x: canvasX, y: canvasY } });
            }

            return newLines;
        });
    }

    useEffect(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 3;
        ctx.fillStyle = "#bababa";
        ctx.strokeStyle = ctx.fillStyle;

        vertices.forEach((vertex) => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        });

        lines.forEach(({ from, to }) => {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.closePath();
            ctx.stroke();
        });
    }, [vertices, lines]);

    return (
        <Canvas
            canvasRef={canvasRef} 
            onMouseDown={setVertex}
            disabled={!!status}
        />
    );
}