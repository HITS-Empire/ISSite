import Canvas from "../../../Canvas";

export default function PaintWindow({
    canvasRef,
    canvas,
    ctx
}) {
    let processIsActive = false;

    const isPainting = () => {
        processIsActive = true;
    }

    const endPainting = () => {
        processIsActive = false;
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
        ctx.liceCap = 'round';
        ctx.strokeStyle = 'white';

        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(canvasX, canvasY);
    }

    return (
        <>
            <Canvas
                canvasRef={canvasRef}
                onMouseDown={isPainting}
                onMouseMove={painting}
                onMouseUp={endPainting}
            />
        </>   
    );
}