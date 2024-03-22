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
                heuristic: 0,
                previousCost: 0,
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
            
            switch (direction) {
                case "NORTH":
                    if (column >= 2 && field[row][column - 2].type === 1) {
                        field[row][column - 1].type = 0;
                        toCheck.push(field[row][column - 2]);
                        barrierIsPlaced = true;
                    }
                    break;
                case "SOUTH":
                    if (column + 2 < count && field[row][column + 2].type === 1) {
                        field[row][column + 1].type = 0;
                        toCheck.push(field[row][column + 2]);
                        barrierIsPlaced = true;
                    }
                    break;
                case "EAST":
                    if (row >= 2 && field[row - 2][column].type === 1) {
                        field[row - 1][column].type = 0;
                        toCheck.push(field[row - 2][column]);
                        barrierIsPlaced = true;
                    }
                    
                case "WEST":
                    if (row + 2 < count && field[row + 2][column].type === 1) {
                        field[row + 1][column].type = 0;
                        toCheck.push(field[row + 2][column]);
                        barrierIsPlaced = true;
                    }
                    break;
            }

            directions.splice(directionIndex, 1);
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
            if (field[i][j].type === 1) {
                field[i][j].type = 0;
            } else if (field[j][i].type === 1) {
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
            type: 1,
            cost: 0,
            heuristic: 0,
            previousCost: 0,
            neighbours: [],
            previous: null
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

// Найти путь до конца поля
export async function findPathInField({
    count,
    field,
    startCell,
    endCell,
    setStatus
}) {
    let openSet = [];
    let closedSet = [];

    for (let row = 0;row < count;row++) {
        for (let column = 0;column < count;column++) {
            for (let n = 0; n < 4; n++) {
                if (cellIsExists(row + 1, column, count) && field[row + 1][column] !== 1) {
                    field[row][column].neighbours.push(field[row + 1][column]);
                }
                if (cellIsExists(row - 1, column, count) && field[row - 1][column] !== 1) {
                    field[row][column].neighbours.push(field[row - 1][column]);
                }
                if (cellIsExists(row, column + 1, count) && field[row][column + 1] !== 1) {
                    field[row][column].neighbours.push(field[row][column + 1]);
                }
                if (cellIsExists(row, column - 1, count) && field[row][column - 1] !== 1) {
                    field[row][column].neighbours.push(field[row][column - 1]);
                }
            }
        }
    }

    openSet.push(startCell);

    while (openSet.length) {
        let current = openSet[0];

        for (let i = 1;i < openSet.length;i++) {
            if (openSet[i].cost < current.cost || (openSet[i].cost === current.cost && current.heuristic < current.heuristic)) {
                    current = openSet[i];
            }
        }
        
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        if (field[current.row][current.column].type !== 2 && field[current.row][current.column].type !== 3) {
            field[current.row][current.column].type = 4;
            field[current.row][current.column].draw();
            if (count > 15) {
                await sleep (20);
            } else {
                await sleep (50);
            }
        }
        
        if (current === endCell) {
            let path = [];
            let temporary = current;
            
            while (temporary) {
                if (temporary === endCell) {
                    temporary.type = 3;
                    temporary.draw();
                    temporary = temporary.previous;
                } else if (temporary === startCell) {
                    temporary.type = 2;
                    temporary.draw();
                    temporary = temporary.previous;
                } else {
                    temporary.type = 5;
                    temporary.draw();
                    temporary = temporary.previous;
                }
                
            }
            
            return setStatus("success");
        }

        for (let neighbour of current.neighbours) {
            if (!closedSet.includes(neighbour)) {
                let tempCost = current.selfCost + 1;
                
                if (openSet.includes(neighbour)) {
                    neighbour.selfCost = tempCost;
                } else {
                    neighbour.selfCost = tempCost;
                    if (neighbour.type !== 1)   {
                        openSet.push(neighbour);
                    }
                }

                neighbour.heuristic = Math.abs(neighbour.column - endCell.column) + Math.abs(neighbour.row - endCell.row);
                
                neighbour.cost = neighbour.previousCost + neighbour.heuristic;
                neighbour.previous = current;
            }
        }
    }
    setStatus("error");
}
