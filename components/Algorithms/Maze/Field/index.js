import Cell from "./Cell";
import style from "./style.module.scss";

export default function Field({
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
    setEndEditorIsActive,
    processIsActive
}) {
    return (
        <div className={style.field}>
            {field.map((line, row) => line.map((cell, column) => (
                <Cell
                    key={(row + 1) * column}
                    row={row}
                    column={column}
                    cell={cell}
                    count={count}
                    field={field}
                    setField={setField}
                    startCell={startCell}
                    setStartCell={setStartCell}
                    endCell={endCell}
                    setEndCell={setEndCell}
                    startEditorIsActive={startEditorIsActive}
                    setStartEditorIsActive={setStartEditorIsActive}
                    endEditorIsActive={endEditorIsActive}
                    setEndEditorIsActive={setEndEditorIsActive}
                    processIsActive={processIsActive}
                />
            )))}
        </div>
    );
}
