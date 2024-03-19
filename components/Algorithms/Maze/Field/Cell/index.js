import style from "../style.module.scss";

export default function Cell({
    row,
    column,
    cell,
    count,
    field,
    setField,
    startCell,
    setStartCell,
    endCell,
    setEndCell,
    startEditorIsActive,
    setStartEditorIsActive,
    endEditorIsActive,
    setEndEditorIsActive
}) {
    let status;
    switch (cell) {
        case 0:
            status = "empty";
            break;
        case 1:
            status = "barrier";
            break;
        case 2:
            status = "start";
            break;
        case 3:
            status = "end";
            break;
        case 4:
            status = "process";
            break;
        case 5:
            status = "path";
    }

    const onClick = () => {
        if (startEditorIsActive) {
            if (row !== startCell.row || column !== startCell.column) {
                field[startCell.row][startCell.column] = 0;
                field[row][column] = 2;

                setStartCell({ row, column });
                setField([...field]);
            }

            return setStartEditorIsActive(false);
        }

        if (endEditorIsActive) {
            if (row !== endCell.row || column !== endCell.column) {
                field[endCell.row][endCell.column] = 0;
                field[row][column] = 3;

                setEndCell({ row, column });
                setField([...field]);
            }

            return setEndEditorIsActive(false);
        }

        if (cell === 2) {
            return setStartEditorIsActive(true);
        }

        if (cell === 3) {
            return setEndEditorIsActive(true);
        }

        field[row][column] = Number(!cell);
        setField([...field]);
    };

    const active = startEditorIsActive && cell === 2 || endEditorIsActive && cell === 3 ? "true" : "false";

    const disabled = (
        startEditorIsActive && (cell === 1 || cell === 3)
    ) || (
        endEditorIsActive && (cell === 1 || cell === 2)
    );

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
