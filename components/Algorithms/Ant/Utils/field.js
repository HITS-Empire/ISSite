import { getRandomElement } from "../../../../utils/helpers";

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
                food: 0
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
export function getAnts(colonyCell, population) {
    return new Array(population).fill(colonyCell);
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
