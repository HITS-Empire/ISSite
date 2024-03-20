import { sleep } from "../../../../utils/sleep";

// Проверить, не выходим ли за границы поля
export function cellIsExists(row, column, count) {
    return 0 <= row && row < count && 0 <= column && column < count;
}

// Получить поле размером N x N
export function getField(count) {
    const field = [];

    for (let row = 0; row < count; row++) {
        const line = [];

        for (let column = 0; column < count; column++) {
            line.push({
                row,
                column,
                type: 1
            });
        }

        field.push(line);
    }

    const startCell = field?.[0]?.[0];
    const endCell = field?.[count - 1]?.[count - 1];

    if (startCell) startCell.type = 0;

    const toCheck = [];

    if (cellIsExists(0, 2, count)) {
        toCheck.push(field[0][2]);
    }
    if (cellIsExists(2, 0, count)) {
        toCheck.push(field[2][0]);
    }

    while (toCheck.length) {
        const index = Math.floor(Math.random() * toCheck.length);
        const cell = toCheck[index];

        cell.type = 0;

        toCheck.splice(index, 1);

        const directions = ["NORTH", "SOUTH", "EAST", "WEST"];
        const { row, column } = cell;
        let barrierIsPlaced = false;

        while (!barrierIsPlaced) {
            const directionIndex = Math.floor(Math.random() * directions.length);
            const direction = directions[directionIndex];

            switch (direction) {
                case "NORTH":
                    if (column >= 2 && field[row][column - 2].type === 0) {
                        field[row][column - 1].type = 0;
                        barrierIsPlaced = true;
                    }
                    break;
                case "SOUTH":
                    if (column + 2 < count && field[row][column + 2].type === 0) {
                        field[row][column + 1].type = 0;
                        barrierIsPlaced = true;
                    }
                    break;
                case "EAST":
                    if (row >= 2 && field[row - 2][column].type === 0) {
                        field[row - 1][column].type = 0;
                        barrierIsPlaced = true;
                    }
                    break;
                case "WEST":
                    if (row + 2 < count && field[row + 2][column].type === 0) {
                        field[row + 1][column].type = 0;
                        barrierIsPlaced = true;
                    }
            }

            directions.splice(directionIndex, 1);
        }

        if (column >= 2 && field[row][column - 2] === 1) {
            toCheck.push({ row, column: column - 2 });
        }
        if (column + 2 < count && field[row][column + 2] === 1) {
            toCheck.push({ row, column: column + 2 });
        }
        if (row >= 2 && field[row - 2][column] === 1) {
            toCheck.push({ row: row - 2, column });
        }
        if (row + 2 < count && field[row + 2][column] === 1) {
            toCheck.push({ row: row + 2, column });
        }
    }

    for (let i = 0; i < 2; i++) {
        const deadEnds = [];

        for (let column = 0; column < count; column++) {
            for (let row = 0; row < count; row++) {  
                if (field[row][column] === 0) {
                    const neighboursCount = (
                        column >= 1 && field[row][column - 1] === 0
                    ) + (
                        column + 1 < count && field[row][column + 1] === 0
                    ) + (
                        column + 1 < count && field[row][column + 1] === 0
                    ) + (
                        row + 1 < count && field[row + 1][column] === 0
                    );

                    if (neighboursCount <= 1) {
                        deadEnds.push(field[row][column]);
                    }
                }
            }
        }

        for (const cell of deadEnds) {
            cell.type = 1;
        }
    }  

    if (startCell) startCell.type = 2;
    if (endCell) endCell.type = 3;

    for (let i = 0; i < 3 && i < count - 1; i++) { 
        for (let j = 0; j < 3 && j < count - 1; j++) {
            if (field[i][j] === 1) {
                field[i][j] = 0;
            } else if (field[j][i] === 1) {
                field[j][i] = 0;
            } else {
                break;
            }
        }
    }

    for (let i = count - 1; i >= 0 && i > count - 4; i--) { 
        for (let j = count - 1; j >= 0 && j > count - 4; j--) {
            if (field[i][j] === 1) {
                field[i][j] = 0;
            } else if (field[j][i] === 1) {
                field[j][i] = 0;
            } else { 
                break;
            }
        }
    }

    return {
        field,
        startCell,
        endCell
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
