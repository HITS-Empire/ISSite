import { sleep } from "../../../../utils/sleep";

// Получить поле размером N x N
export function getField(count) {
    const field = [];

    for (let i = 0; i < count; i++) {
        const line = [];

        for (let j = 0; j < count; j++) {
            let cell;
            
            const isStart = !i && !j;
            const isEnd = i === count - 1 && j === count - 1;

            if (!isStart && !isEnd) {
                if (Math.random() < 0.5) {
                    cell = 0;
                } else {
                    cell = 1;
                }
            }
            if (isStart) {
                cell = 2;
            }
            if (isEnd) {
                cell = 3;
            }

            line.push(cell);
        }

        field.push(line);
    }

    return {
        field,
        startCell: {
            row: 0,
            column: 0
        },
        endCell: {
            row: count - 1,
            column: count - 1
        }
    };
}

// Получить поле для поиска пути
export function getExtendedField(field) {
    return field.map((line, row) => {
        return line.map((cell, column) => ({
            row,
            column,
            type: cell,
            move: -1
        }));
    });
}

// Проверить, не выходим ли за границы поля
export function cellIsExists(row, column, count) {
    return 0 <= row && row < count && 0 <= column && column < count;
}

// Получить следующую итерацию
export function getNextCell(i, { row, column }) {
    switch (i) {
        case 0:
            row++;
            break;
        case 1:
            row--;
            break;
        case 2:
            column++;
            break;
        case 3:
            column--;
    }

    return { row, column };
}

// Построить путь
export function constructPath({
    count,
    field,
    setField,
    endCell,
    extendedField
}) {
    // Обновить поле перед проходом
    setField((field) => field);

    let extendedCell = extendedField[endCell.row][endCell.column];
    let step = extendedCell.move;

    while (step > 1) {
        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, extendedCell);

            if (!cellIsExists(row, column, count)) continue;
            if (extendedField[row][column].move === -1) continue;
            if (extendedField[row][column].move >= step) continue;
            if (extendedField[row][column].type) continue;

            field[row][column] = 5;
            extendedCell = extendedField[row][column];
            step = extendedCell.move;
            break;
        }
    }

    setField([...field]);
}

// Найти путь до конца поля
export async function findPathInField({
    count,
    field,
    setField,
    startCell,
    endCell,
    setStatus
}) {
    const extendedField = getExtendedField(field);

    extendedField[startCell.row][startCell.column].move = 0;

    const queue = [extendedField[startCell.row][startCell.column]];
    let step = 0;

    while (queue.length) {
        const extendedCell = queue.shift();

        if (extendedCell.move > step) {
            setField([...field]);
            step++;

            await sleep(50);
        }

        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, extendedCell);

            if (!cellIsExists(row, column, count)) continue;
            if (extendedField[row][column].move !== -1) continue;

            if (extendedField[row][column].type === 0 || extendedField[row][column].type === 3) {
                extendedField[row][column].move = extendedCell.move + 1;
            }

            // Нашли конец пути
            if (extendedField[row][column].type === 3) {
                constructPath({
                    count,
                    field,
                    setField,
                    endCell,
                    extendedField
                });

                return setStatus("success");
            }

            if (extendedField[row][column].type) continue;

            field[row][column] = 4;
            queue.push(extendedField[row][column]);
        }
    }

    setStatus("error");
}
