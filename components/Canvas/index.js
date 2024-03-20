import style from "./style.module.scss";

export default function Canvas({
    canvasRef,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseOut
}) {
    return (
        <div className={style.canvas}>
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onMouseOut={onMouseOut}
            />
        </div>
    );
}
