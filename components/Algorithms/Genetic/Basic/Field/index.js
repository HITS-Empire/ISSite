import { useEffect } from "react";
import Canvas from "../../../../Canvas";

export default function Field({
    vertices,
    setVertices,
    lines,
    setLines,
    canvasRef,
    canvas,
    ctx
}) {
    const setVertex = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const canvasX = x * (canvas.width / rect.width);
        const canvasY = y * (canvas.height / rect.height);

        setVertices([...vertices, { x: canvasX, y: canvasY }]);

        setLines(prevLines => {
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

        ctx.fillStyle = "white";

        vertices.forEach((vertex) => {
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 15, 0, 2 * Math.PI);
            ctx.fill();
        });

        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;

        lines.forEach(({ from, to }) => {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        });
    }, [vertices, lines]);

    return (
        <Canvas
            canvasRef={canvasRef} 
            onMouseDown={setVertex}
        />
    );
}
