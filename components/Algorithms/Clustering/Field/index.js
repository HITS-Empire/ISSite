import Canvas from "../../../Canvas";

export default function Field({
    points,
    setPoints,
    canvasRef,
    canvas,
    ctx
}) {
    const setPoint = (e) => {
        if (!ctx) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const canvasX = x * (canvas.width / rect.width);
        const canvasY = y * (canvas.height / rect.height);

        setPoints([...points, { x: canvasX, y: canvasY }]);

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    return (
        <Canvas
            canvasRef={canvasRef}
            onMouseDown={setPoint}
        />
    );
}
