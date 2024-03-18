import style from "../style.module.scss";

export default function Cell({
    count,
    field,
    setField,
    cell,
    startEditorIsActive,
    setStartEditorIsActive,
    endEditorIsActive,
    setEndEditorIsActive,
    startCell,
    endCell
}) {
    const {
        isBarrier,
        isStart,
        isEnd
    } = cell;

    const status = isBarrier ? "barrier" : isStart ? "start" : isEnd ? "end" : "active";

    const onClick = () => {
        if (startEditorIsActive) {
            if (cell !== startCell) {
                startCell.isStart = false;
                cell.isStart = true;
                setField([...field]);
            }

            return setStartEditorIsActive(false);
        }

        if (endEditorIsActive) {
            if (cell !== endCell) {
                endCell.isEnd = false;
                cell.isEnd = true;
                setField([...field]);
            }

            return setEndEditorIsActive(false);
        }

        if (isStart) {
            return setStartEditorIsActive(true);
        }

        if (isEnd) {
            return setEndEditorIsActive(true);
        }

        cell.isBarrier = !isBarrier;
        setField([...field]);
    };

    const active = startEditorIsActive && isStart || endEditorIsActive && isEnd ? "true" : "false";
    const disabled = startEditorIsActive && (isEnd || isBarrier) || endEditorIsActive && (isStart || isBarrier);

    return (
        <button
            className={`${style.cell} ${style[status]}`}
            onClick={onClick}
            active={active}
            disabled={disabled}
            style={{
                width: `calc(100% / ${count})`,
                height: `calc(100% / ${count})`
            }}
        />
    );
}
