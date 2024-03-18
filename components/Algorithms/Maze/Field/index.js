import Cell from "./Cell";
import Screen from "../../../Screen";

export default function Field({
    count,
    field,
    setField,
    borderEditorIsActive,
    startEditorIsActive,
    endEditorIsActive
}) {
    return (
        <Screen>
            {field.map((line) => line.map((cell, key) => (
                <Cell
                    key={key}
                    count={count}
                    isBarrier={cell.isBarrier}
                    isStart={cell.isStart}
                    isEnd={cell.isEnd}
                />
            )))}
        </Screen>
    );
}
