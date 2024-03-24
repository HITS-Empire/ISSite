import { getRandomElement, sleep } from "../../../../utils/helpers";

// Проверить, не выходим ли за границы поля
export function cellIsExists(row, column, count) {
    return 0 <= row && row < count && 0 <= column && column < count;
}

// Получить поле для муравьиной колонии
export function getField(count) {
    const field = [];

    for (let row = 0; row < count; row++) {
        const line = [];

        for (let column = 0; column < count; column++) {
            line.push({
                row,
                column,
                type: Number(Math.random() < 0.2),
                food: 0,
                ants: 0
            });
        }

        field.push(line);
    }

    const colonyCell = getRandomElement(getRandomElement(field));
    if (colonyCell) colonyCell.type = 2;

    // Положить еду в случайное место
    let foodCell;
    while (count > 1 && (!foodCell || foodCell === colonyCell)) {
        foodCell = getRandomElement(getRandomElement(field));
    }

    if (foodCell) {
        foodCell.type = 0;
        foodCell.food = 1;
    }

    return {
        field,
        colonyCell
    };
}

// Получить муравьёв для колонии
export function getAnts(field, colonyCell, population) {
    const ants = [];

    field.forEach((line) => line.forEach((cell) => {
        cell.ants = 0;
    }));

    if (colonyCell) {
        colonyCell.ants = population;
    }

    for (let i = 0; i < population; i++) {
        ants.push({
            cell: colonyCell,
            leftIndent: Math.random() * 100,
            topIndent: Math.random() * 100
        });
    }

    return ants;
}

// Получить первую попавшуюся пустую ячейку поля
export function getEmptyCell(field) {
    for (let column = 0; column < field.length; column++) {
        for (let row = 0; row < field.length; row++) {
            const cell = field[row][column];

            if (cell.type !== 1 && cell.type !== 2 && !cell.food) {
                return cell;
            }
        }
    }
}

// Получить все ячейки с едой
export function getCellsWithFood(field) {
    const cells = [];

    field.forEach((line) => line.forEach((cell) => {
        if (cell.food) {
            cells.push(cell);
        }
    }));

    return cells;
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

// Одна итерация муравьиной колонии
export async function runColony({
    count,
    field,
    ants,
    setAnts
}) {
    ants.forEach((ant) => {
        const neighboringCells = [];

        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, ant.cell);

            if (!cellIsExists(row, column, count)) continue;

            if (field[row][column].type !== 1) {
                neighboringCells.push(field[row][column]);
            }
        }

        if (neighboringCells.length) {
            ant.cell.ants--;
            ant.cell = getRandomElement(neighboringCells);
            ant.cell.ants++;
        }
    });

    setAnts([...ants]);

    await sleep(200);
}
