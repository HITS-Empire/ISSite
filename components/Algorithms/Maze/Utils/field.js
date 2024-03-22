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
                type: 1,
                cost: 0,
                previousCost: 0,
                selfCost: 0,
                neighbours: [],
                previous: null
            });
        }

        field.push(line);
    }

    const startCell = field?.[0]?.[0];
    const endCell = field?.[count - 1]?.[count - 1];

    if (startCell) startCell.type = 0;

    const toCheck = [];

    const row = Math.floor(Math.random() * Math.floor(count / 2)) * 2 + 1;
    const column = Math.floor(Math.random() * Math.floor(count / 2)) * 2 + 1;

    if (row >= 2) {
        toCheck.push(field[row - 2][column]);
    }
    if (row + 2 < count) {
        toCheck.push(field[row + 2][column]);
    }
    if (column >= 2) {
        toCheck.push(field[row][column - 2]);
    }
    if (column + 2 < count) {
        toCheck.push(field[row][column + 2]);
    }

    while (toCheck.length) {
        const index = 0;
        const cell = toCheck[index];

        cell.type = 0;

        toCheck.splice(index, 1);

        const directions = ["NORTH", "SOUTH", "EAST", "WEST"];
        const { row, column } = cell;
        let barrierIsPlaced = false;

        while (directions.length && !barrierIsPlaced) {
            const directionIndex = Math.floor(Math.random() * directions.length);
            const direction = directions[directionIndex];
            if (directions.length == 0) break;
            switch (direction) {
                case "NORTH":
                    if (column >= 2 && field[row][column - 2].type === 0) {
                        field[row][column - 1].type = 0;
                        barrierIsPlaced = true;
                    }
                    break;

                case "EAST":
                    if (row >= 2 && field[row - 2][column].type === 0) {
                        field[row - 1][column].type = 0;
                        barrierIsPlaced = true;
                    }
                    break;

            }

            directions.splice(directionIndex, 1);
        }


        if (column + 2 < count && field[row][column + 2].type === 1) {
            toCheck.push(field[row][column + 2]);
        }

        if (row + 2 < count && field[row + 2][column].type === 1) {
            toCheck.push(field[row + 2][column]);
        }
    }

    for (let i = 0; i < 2; i++) {
        const deadEnds = [];

        for (let column = 0; column < count; column++) {
            for (let row = 0; row < count; row++) {  
                if (field[row][column] === 0) {
                    const neighboursCount = (
                        column >= 1 && field[row][column - 1].type === 0
                    ) + (
                        column + 1 < count && field[row][column + 1].type === 0
                    ) + (
                        column + 1 < count && field[row][column + 1].type === 0
                    ) + (
                        row + 1 < count && field[row + 1][column].type === 0
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

    if (endCell) endCell.type = 3;
    if (startCell) startCell.type = 2;

    for (let i = 0; i < 3 && i < count - 1; i++) { 
        for (let j = 0; j < 3 && j < count - 1; j++) {
            if (field[i][j].type === 1) {
                field[i][j].type = 0;
            } else if (field[j][i].type === 1) {
                field[j][i].type = 0;
            } else {
                break;
            }
        }
    }

    for (let i = count - 1; i >= 0 && i > count - 4; i--) { 
        for (let j = count - 1; j >= 0 && j > count - 4; j--) {
            if (field[i][j] === 1) {
                field[i][j].type = 0;
            } else if (field[j][i] === 1) {
                field[j][i].type = 0;
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
    endCell
}) {
    let cell = endCell;

    while (cell.move > 1) {
        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, cell);

            if (!cellIsExists(row, column, count)) continue;
            if (field[row][column].type !== 4) continue;
            if (field[row][column].move >= cell.move) continue;

            field[row][column].type = 5;
            cell = field[row][column];
            cell.draw();

            break;
        }
    }
}

// Посчитать стоимость перехода
export function findCost({
    field,
    row,
    column
}) {
    field[row][column].cost = field[row][column].selfCost + field[row][column].previousCost;
}

// Найти путь до конца поля
export async function findPathInField({
    count,
    field,
    startCell,
    endCell,
    setStatus
}) {
    startCell.move = 0;

    const queue = [startCell];
    let found = false;
    let step = 0;

    while (queue.length) {
        const cell = queue.shift();

        if (cell.move > step) {
            if (found) {
                constructPath({
                    count,
                    field,
                    endCell
                });

                return setStatus("success");
            }
        }

        openSet = openSet.filter(startCell => startCell !== current);
        closedSet.push(current);

        if (current == end) {
            let path = [];
            let temporary = current;
            
            while (temporary) {
                path.push(temporary);
                temporary = temporary.previous;
            }
        }

        for (let neighbours of current.neighbours) {
            if (!closedSet.includes(neighbours)) {
                let tempCost = current.selfCost + 1;
            }
        }
    }
}
