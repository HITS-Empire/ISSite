// Создать Canvas и его контекст
export function createCanvas({
    canvasRef,
    setCanvas,
    setCtx,
    size
}) {
    const canvas = canvasRef.current;

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    
    setCanvas(canvas);
    setCtx(ctx);
}
