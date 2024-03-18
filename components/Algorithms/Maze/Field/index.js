import Cell from "./Cell";
import style from "./style.module.scss";
import { getCell } from "../Utils/field";

export default function Field({
    count,
    field,
    setField,
    startEditorIsActive,
    setStartEditorIsActive,
    endEditorIsActive,
    setEndEditorIsActive
}) {
    const startCell = getCell(field, "isStart");
    const endCell = getCell(field, "isEnd");

    return (
        <div className={style.field}>
            {field.map((line, row) => line.map((cell, column) => (
                <Cell
                    key={(row + 1) * column}
                    count={count}
                    field={field}
                    setField={setField}
                    cell={cell}
                    startEditorIsActive={startEditorIsActive}
                    setStartEditorIsActive={setStartEditorIsActive}
                    endEditorIsActive={endEditorIsActive}
                    setEndEditorIsActive={setEndEditorIsActive}
                    startCell={startCell}
                    endCell={endCell}
                />
            )))}
        </div>
    );
}
