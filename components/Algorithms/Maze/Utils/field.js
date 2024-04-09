import { getRandomElement, sleep } from "../../../../utils/helpers";

// Проверить, не выходим ли за границы поля
export function cellIsExists(row, column, count) {
    return 0 <= row && row < count && 0 <= column && column < count;
}

// Стереть барьеры вокруг ячейки
export function clearBorders(cell, count, field) {
    const { row, column } = cell;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (cellIsExists(row + i, column + j, count) && field[row + i][column + j].type === 1) {
                field[row + i][column + j].type = 0;
            }
        }
    }
}

// Получить поле размером N x N
export function getField(count) {
    const field = [];

    if (count <= 1) {
        return { field, startCell: null, endCell: null };
    }

    for (let row = 0; row < count; row++) {
        const line = [];

        for (let column = 0; column < count; column++) {
            line.push({
                row,
                column,
                type: 1,
                cost: Infinity,
                heuristic: 0,
                selfCost: Infinity,
                neighbours: [],
                previous: null
            });
        }

        field.push(line);
    };

    const isEven = (n) => {
        return n % 2 === 0;
    }

    const setCell = (row, column, value) => {
        if (cellIsExists(row, column, count)) {
            field[row][column].type = value;
        }
    }

    const isEnd = () => {
        for (let row = 0; row < count; row++) {
            for (let column = 0; column < count; column++) {
                if (isEven(row) && isEven(column) && field[column][row].type === 1) {
                    return false;
                }
            }
        }

        return true;
    }

    const clearCellWithTracktors = () => {
        for (const tractor of tractors) {
            const directions = [];

            if (tractor.x > 0) {
                directions.push("WEST");
            }
            if (tractor.x < count - 2) {
                directions.push("EAST");
            }
            if (tractor.y > 0) {
                directions.push("NORTH");
            }
            if (tractor.y < count - 2) {
                directions.push("SOUTH");
            }
    
            const direction = getRandomElement(directions);

            switch (direction) {
                case "WEST":
                    if (field[tractor.x - 2][tractor.y].type === 1) {
                        setCell(tractor.x - 2, tractor.y, 0);
                        setCell(tractor.x - 1, tractor.y, 0);
                    }
                    tractor.x -= 2;
                    break;
                case "EAST":
                    if (field[tractor.x + 2][tractor.y].type === 1) {
                        setCell(tractor.x + 2, tractor.y, 0);
                        setCell(tractor.x + 1, tractor.y, 0);
                    }
                    tractor.x += 2;
                    break;
                case "NORTH":
                    if (field[tractor.x][tractor.y - 2].type === 1) {
                        setCell(tractor.x, tractor.y - 2, 0);
                        setCell(tractor.x, tractor.y - 1, 0);
                    }
                    tractor.y -= 2;
                    break;
                case "SOUTH":
                    if (field[tractor.x][tractor.y + 2].type === 1) {
                        setCell(tractor.x, tractor.y + 2, 0);
                        setCell(tractor.x, tractor.y + 1, 0);
                    }
                    tractor.y += 2;
                    break;
            }
        }
    }

    const startX = getRandomElement(Array(count).fill(0).map((item, index) => index).filter(x => isEven(x)));
    const startY = getRandomElement(Array(count).fill(0).map((item, index) => index).filter(x => isEven(x)));

    const numberOfTractors = 500;
    var tractors = [];

    for (let i = 0; i < numberOfTractors; i++) {
        tractors.push({ x: startX, y: startY });
    }

    setCell(startX, startY, 0);

    while (!isEnd()) {
        clearCellWithTracktors();
    }

    const startCell = field?.[0]?.[0];
    const endCell = field?.[count - 1]?.[count - 1];

    if (startCell) startCell.type = 2;
    if (endCell) endCell.type = 3;

    clearBorders(startCell, count, field);
    clearBorders(endCell, count, field);

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
            selfCost: 0,
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
    renderingDelay,
    field,
    startCell,
    endCell,
    setStatus
}) {
    let openSet = [];
    let closedSet = [];

    for (let row = 0; row < count; row++) {
        for (let column = 0; column < count; column++) {
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

    startCell.cost = 0;
    startCell.heuristic = Math.abs(startCell.column - endCell.column) + Math.abs(startCell.row - endCell.row);
    startCell.selfCost = startCell.cost + startCell.heuristic;
    
    openSet.push(startCell);

    while (openSet.length) {
       let current = openSet[0];

        for (let i = 1;i < openSet.length;i++) {
            if (openSet[i].selfCost < current.selfCost) {
                current = openSet[i];
            }
        }

        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);

        if (field[current.row][current.column].type !== 2 && field[current.row][current.column].type !== 3) {
            field[current.row][current.column].type = 4;
            field[current.row][current.column].draw();

            await sleep(renderingDelay);
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

            return setStatus(1);
        }

        for (let neighbour of current.neighbours) {
            if (!closedSet.includes(neighbour)) {
                let tempCost = current.cost + 1;

                if (!openSet.includes(neighbour) || tempCost < neighbour.cost) {
                    neighbour.cost = tempCost;
                    neighbour.heuristic = Math.abs(neighbour.column - endCell.column) + Math.abs(neighbour.row - endCell.row);
                    neighbour.selfCost = neighbour.cost + neighbour.heuristic;
                    
                    neighbour.previous = current;
                    if (!openSet.includes(neighbour) && neighbour.type !== 1) {
                        openSet.push(neighbour);
                    }
                }
            }
        }
    }

    setStatus(2);
}
