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
                ants: 0,
                pheromone: {
                    colony: {
                        previos: 0,
                        amount: 0,
                        history: []
                    },
                    food: {
                        previos: 0,
                        amount: 0,
                        history: []
                    }
                }
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
            look: Math.random() * Math.PI * 2,
            behavior: {
                /*
                 * Доступные типы поведения:
                 * 1. findFood - найти еду
                 * 2. goToFood - идти по дороге до еды
                 * 3. goToColony - идти по дороге до дома
                 * 4. chaos - хаотично искать колонию
                 */
                type: "findFood",
                pheromoneStorage: {
                    colony: 0,
                    food: 0
                },
                previosPheromone: {
                    colony: 0,
                    food: 0
                },
                notFound: {
                    colony: 0,
                    food: 0
                },
                memory: []
            }
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

export function putPheromoneInCell(cell, type, value) {
    const pheromone = cell.pheromone[type];

    pheromone.history.push(value);

    pheromone.amount = Math.min(Math.max(pheromone.amount + value, 0), 1);
}

// Одна итерация муравьиной колонии
export function runColony({
    count,
    field,
    ants,
    setAnts,
}) {
    // Феромоны улетучиваются на каждой итерации
    field.forEach((line) => line.forEach((cell) => {
        for (const type in cell.pheromone) {
            const pheromone = cell.pheromone[type];

            let sumOfAmount = 0;

            pheromone.history = pheromone.history
                .map((amount) => {
                    amount -= 0.0003;

                    if (amount > 0) {
                        sumOfAmount += amount;
                    }

                    return amount;
                })
                .filter((amount) => amount > 0);

            pheromone.amount = Math.min(Math.max(sumOfAmount, 0), 1);
        }
    }));

    ants.forEach((ant) => {
        if (ant.behavior.memory.length === 2) {
            ant.behavior.memory.unshift();
        }
        ant.behavior.memory.push(ant.cell);

        // Посмотреть на обстановку вокруг
        if (ant.cell.type === 2) {
            ant.behavior.type = "findFood";

            ant.behavior.pheromoneStorage.colony = Math.random() * 16;
            ant.behavior.pheromoneStorage.food = 0;

            ant.behavior.notFound.colony = 0;
            ant.behavior.notFound.food = 0;
        } else if (ant.behavior.type === "chaos" && ant.cell.pheromone.colony.amount) {
            ant.behavior.type = "goToColony";
        }

        // Положить нужные феромоны
        if (ant.behavior.pheromoneStorage.colony) {
            let value;

            if (!ant.behavior.previosPheromone.colony) {
                value = Math.random() * 0.05;
            } else {
                // Предыдущее значение, минус шаг испарения, минус случайная величина
                value = Math.max(
                    ant.behavior.previosPheromone.colony - Math.random() * 0.005 - 0.0003,
                    0
                );
            }
            value = Math.min(value, ant.behavior.pheromoneStorage.colony);

            if (value) {
                ant.behavior.pheromoneStorage.colony -= value;
                ant.behavior.previosPheromone.colony = value;

                putPheromoneInCell(ant.cell, "colony", value);
            }

            // "Силы" закончились, нужно вернуться домой
            if (!value || !ant.behavior.pheromoneStorage.colony) {
                ant.behavior.type = "goToColony";

                ant.behavior.pheromoneStorage.colony = 0;
                ant.behavior.previosPheromone.colony = 0;
            }
        }

        const availableCells = [];

        // Проверить, не замурован ли муравей
        for (let i = 0; i < 4; i++) {
            const { row, column } = getNextCell(i, ant.cell);

            if (!cellIsExists(row, column, count)) continue;

            if (field[row][column].type !== 1) {
                availableCells.push(field[row][column]);
            }
        }

        // Если муравей замурован, то ничего не делать
        if (!availableCells.length) return;

        // Следующий шаг (cell и position)
        let nextStep;

        if (ant.behavior.type === "goToColony") {
            // Отсортировать в порядке привлекательности
            let attractiveCells = availableCells
                .filter((cell) => cell.pheromone.colony.amount)
                .sort((firstCell, secondCell) => {
                    return secondCell.pheromone.colony.amount - firstCell.pheromone.colony.amount;
                });

            if (attractiveCells.length) {
                // Не ходить туда, где муравей был на прошлом ходе
                if (attractiveCells.length > 1 && ant.behavior.memory.length === 2) {
                    attractiveCells = attractiveCells.filter((cell) => (
                        cell !== ant.behavior.memory[0]
                    ));
                }
    
                // Случайный индекс, близкий к 0
                const index = Math.floor((1 - Math.sin(Math.acos(Math.random()))) * attractiveCells.length);

                // Пойти в привлекательную ячейку
                nextStep = {
                    cell: attractiveCells[index],
                    position: { x: 0.5, y: 0.5 }
                };
            } else {
                // Не нашли колонию, а значит начинается хаос
                ant.behavior.type = "chaos";
            }
        }

        if (ant.behavior.type === "findFood" || ant.behavior.type === "chaos") {
            // Если муравей в тупике, то развернуть его
            if (availableCells.length === 1) {
                ant.position.x = 0.5;
                ant.position.y = 0.5;
            }

            // С вероятностью 30% изменить взгляд муравья ("передумал")
            if (Math.random < 0.3) {
                ant.look = Math.random() * Math.PI * 2;
            }

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
        }

        ant.cell.ants--;
        ant.cell = nextStep.cell;
        ant.cell.ants++;

        ant.position = nextStep.position;
    });

    // Перерендерить феромоны на поле
    field.forEach((line) => line.forEach((cell) => {
        for (const type in cell.pheromone) {
            const pheromone = cell.pheromone[type];

            const ceilPrevios = Math.ceil(pheromone.previos * 100);
            const ceilAmount = Math.ceil(pheromone.amount * 100);

            // Перерисовать блок только тогда, когда значение феромона изменилось на 0.01
            if (Math.abs(ceilAmount - ceilPrevios)) {
                cell.draw();
            }

            pheromone.previos = pheromone.amount;
        }
    }));

    setAnts([...ants]);
}
