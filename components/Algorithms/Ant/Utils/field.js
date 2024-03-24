import { getRandomElement } from "../../../../utils/helpers";

// Стороны квадрата
const sides = [
    { x: 0, y: 0, delta: { x: false, y: true } },
    { x: 0, y: 1, delta: { x: true, y: false } },
    { x: 1, y: 0, delta: { x: true, y: false } },
    { x: 1, y: 1, delta: { x: false, y: true } }
];

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
            topIndent: Math.random() * 100,
            position: {
                x: 0.5,
                y: 0.5
            },
            look: Math.random() * Math.PI * 2
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

// Получить позицию взгляда в квадрате по его углу
export function getPositionOnSide(position, look) {
    const k = Math.tan(look);
    const b = position.y - k * position.x;

    return sides.map((side) => {
        // Вертикальная сторона
        if (!side.delta.x) {
            return {
                x: side.x,
                y: k * side.x + b
            };
        }

        // Горизонтальная сторона
        if (!side.delta.y) {
            return {
                x: (side.y - b) / k,
                y: side.y
            };
        }
    }).filter((positionOnSide) => {
        const { x, y } = positionOnSide;

        return (
            x !== position.x && y !== position.y
        ) && (
            0 <= x && x <= 1 && 0 <= y && y <= 1
        ) && (
            position.x !== 0.5 || position.y !== 0.5 || (
                x === 0 && (
                    look >= Math.PI / 2 && look < Math.PI
                ) || x === 1 && (
                    look < Math.PI / 2 || look >= Math.PI
                ) || y === 0 && (
                    look >= Math.PI
                ) || y === 1 && (
                    look < Math.PI
                )
            )
        );
    })[0];
}

// Одна итерация муравьиной колонии
export function runColony({
    count,
    field,
    ants,
    setAnts
}) {
    ants.forEach((ant) => {
        let availableCellsCount = 0;

        // Проверить, не замурован ли муравей
        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, ant.cell);

            if (!cellIsExists(row, column, count)) continue;

            if (field[row][column].type !== 1) {
                availableCellsCount++;
            }
        }

        // Если муравей замурован, то ничего не делать
        if (!availableCellsCount) return;

        // Если муравей в тупике, то развернуть его
        if (availableCellsCount === 1) {
            ant.position.x = Math.abs(ant.position.x - 1);
            ant.position.y = Math.abs(ant.position.y - 1);
        }

        // С вероятностью 30% изменить взгляд муравья ("передумал")
        if (Math.random < 0.3) {
            ant.look = Math.random() * Math.PI * 2;
        }

        let nextStep;

        // Найти ячейку и позицию для следующего шага муравья
        while (!nextStep) {
            let { x, y } = getPositionOnSide(ant.position, ant.look);
            let { row, column } = ant.cell;

            if (x === 0) {
                row--;
                x = 1;
            } else if (x === 1) {
                row++;
                x = 0;
            } else if (y === 0) {
                column--;
                y = 1;
            } else if (y === 1) {
                column++;
                y = 0;
            }

            if (cellIsExists(row, column, count) && field[row][column].type !== 1) {
                nextStep = {
                    cell: field[row][column],
                    position: { x, y }
                };
            } else {
                // Изменить взгляд муравья (имитация ударения об стенку)
                ant.look = Math.random() * Math.PI * 2;
            }
        }

        ant.cell.ants--;
        ant.cell = nextStep.cell;
        ant.cell.ants++;

        ant.position = nextStep.position;
    });

    setAnts([...ants]);
}
