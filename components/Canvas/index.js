import style from "./style.module.scss";

export default function Canvas({
    className,
    canvasRef,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseOut,
    disabled
}) {
    let classNames = [style.canvas];

    if (className) {
        classNames.push(className);
    }
    if (disabled) {
        classNames.push(style.disabled);
    }

    classNames = classNames.join(" ");

    return (
        <div className={classNames}>
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
