import {
    getNearRandom,
    getRandomElement
} from "../../../../utils/helpers";

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
                follow: null,
                pheromoneStorage: {
                    colony: 0,
                    food: 0
                },
                previosPheromone: {
                    colony: 0,
                    food: 0
                },
                memory: [],
                initialFoodPheromone: 0
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

    return sides
        .map((side) => {
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
        })
        .filter((positionOnSide) => {
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

// Положить феромон в ячейку
export function putPheromoneInCell(ant, type, value) {
    const pheromone = ant.cell.pheromone[type];

    pheromone.history.push({ ant, value });

    pheromone.amount = Math.min(Math.max(pheromone.amount + value, 0), 1);
}

// Получить значение феромона для "отложения" и положить его
export function getNextPheromoneValueAndPutIt(ant, initialPheromone, type) {
    let value;

    if (!ant.behavior.previosPheromone[type]) {
        // Первый феромон
        value = Math.min(
            Math.random() * initialPheromone,
            ant.behavior.pheromoneStorage[type]
        );
    } else {
        const step = Math.random() * 0.001; // Случайный шаг

        // Предыдущее значение, минус случайная величина, минус 2 шага испарения
        value = Math.max(
            ant.behavior.previosPheromone[type] - step - 0.002,
            0
        );
    }

    if (value <= 0.002) value = 0;

    value = Math.min(value, ant.behavior.pheromoneStorage[type]);

    if (value) {
        ant.behavior.pheromoneStorage[type] -= value;
        ant.behavior.previosPheromone[type] = value;

        putPheromoneInCell(ant, type, value);
    }

    return value;
}

// Сходить в наиболее привлекательную клетку
const goToAttractiveCell = (ant, availableCells, type) => {
    // Отсортировать в порядке привлекательности
    let attractiveCells = availableCells
        .filter((cell) => {
            return cell.pheromone[type].history.find((record) => (
                ant.behavior.follow === record.ant
            ));
        })
        .sort((firstCell, secondCell) => {
            return (
                secondCell.pheromone[type].history.find((record) => (
                    ant.behavior.follow === record.ant
                )).value
            ) - (
                firstCell.pheromone[type].history.find((record) => (
                    ant.behavior.follow === record.ant
                )).value
            );
        });

    if (attractiveCells.length) {
        // Не ходить туда, где муравей был на прошлом ходе
        if (attractiveCells.length > 1 && ant.behavior.memory.length === 2) {
            attractiveCells = attractiveCells.filter((cell) => (
                cell !== ant.behavior.memory[0]
            ));
        }

        // Пойти в привлекательную ячейку
        return {
            cell: attractiveCells[0],
            position: { x: 0.5, y: 0.5 }
        };
    }
};

// Одна итерация муравьиной колонии
export function runColony({
    count,
    field,
    ants,
    setAnts,
}) {
    // Периметр поля
    const perimeter = count * 4;

    // Начальное значение феромона колонии
    const initialColonyPheromone = 0.002 * perimeter;

    // Максимальная сумма феромонов, нужная муравьям, чтобы перейти из угла в противоположный угол
    const maxColonyPheromoneStorage = (initialColonyPheromone + 0.002) / 2 * perimeter;

    // Феромоны улетучиваются на каждой итерации
    field.forEach((line) => line.forEach((cell) => {
        for (const type in cell.pheromone) {
            const pheromone = cell.pheromone[type];

            let sumOfValues = 0;

            pheromone.history = pheromone.history
                .map((record) => {
                    record.value -= 0.001;

                    if (record.value > 0) {
                        sumOfValues += record.value;
                    }

                    return record;
                })
                .filter((record) => record.value > 0);

            pheromone.amount = Math.min(Math.max(sumOfValues, 0), 1);
        }
    }));

    ants.forEach((ant) => {
        if (ant.behavior.memory.length === 2) {
            ant.behavior.memory.splice(0, 1);
        }
        ant.behavior.memory.push(ant.cell);

        // Посмотреть на обстановку вокруг
        if (ant.cell.type === 2) {
            ant.behavior.type = "findFood";
            ant.behavior.follow = null;

            ant.behavior.pheromoneStorage.colony = maxColonyPheromoneStorage * Math.random();
            ant.behavior.pheromoneStorage.food = 0;

            ant.behavior.initialFoodPheromone = 0;
        } else {
            // Муравей наконец нашёл путь домой
            if (ant.behavior.type === "chaos" && ant.cell.pheromone.colony.amount) {
                ant.behavior.type = "goToColony";
                ant.behavior.follow = ant.cell.pheromone.colony.history[0].ant;
            }

            // Муравей нашёл еду, нужно дать ему феромоны еды
            if (ant.behavior.type !== "chaos" && ant.cell.food) {
                ant.behavior.type = "goToColony";
                ant.behavior.follow = ant;

                ant.behavior.pheromoneStorage.colony = 0;
                ant.behavior.previosPheromone.colony = 0;

                // Коэффициент еды
                const foodAppeal = 1 + ant.cell.food / 64;

                // Начальное значение феромона еды
                ant.behavior.initialFoodPheromone = foodAppeal * 0.002 * perimeter;

                // Максимальная сумма феромонов
                const maxPheromoneFoodStorage = (ant.behavior.initialFoodPheromone + 0.002) / 2 * perimeter;

                ant.behavior.pheromoneStorage.food = maxPheromoneFoodStorage * Math.random();
            }

            // Если муравей ищет еду и наткнулся на след от еды, то с каким-то шансом последовать по нему
            if (ant.behavior.type === "findFood" && ant.cell.pheromone.food.amount) {
                if (0.02 * Math.random() * perimeter < ant.cell.pheromone.food.amount) {
                    ant.behavior.type = "goToFood";
                    ant.behavior.follow = ant.cell.pheromone.food.history[0].ant
                }
            }
        }

        // Положить нужные феромоны
        if (ant.behavior.pheromoneStorage.colony) {
            const value = getNextPheromoneValueAndPutIt(ant, initialColonyPheromone, "colony");

            // "Силы" закончились, нужно вернуться домой
            if (!value || !ant.behavior.pheromoneStorage.colony) {
                ant.behavior.type = "goToColony";
                ant.behavior.follow = ant;

                ant.behavior.pheromoneStorage.colony = 0;
                ant.behavior.previosPheromone.colony = 0;
            }
        }
        if (ant.behavior.pheromoneStorage.food) {
            const value = getNextPheromoneValueAndPutIt(ant, ant.behavior.initialFoodPheromone, "food");

            if (!value || !ant.behavior.pheromoneStorage.food) {
                ant.behavior.pheromoneStorage.food = 0;
                ant.behavior.previosPheromone.food = 0;

                ant.behavior.initialFoodPheromone = 0;
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

        // Если муравей в тупике, то развернуть его
        if (availableCells.length === 1) {
            ant.position.x = 0.5;
            ant.position.y = 0.5;
        }

        // С вероятностью 30% изменить взгляд муравья ("передумал")
        if (Math.random < 0.3) {
            ant.look = Math.random() * Math.PI * 2;
        }

        // Следующий шаг (cell и position)
        let nextStep;

        if (ant.behavior.type === "goToColony") {
            nextStep = goToAttractiveCell(ant, availableCells, "colony");

            // Не нашли колонию, а значит начинается хаос
            if (!nextStep) {
                ant.behavior.type = "chaos";
            }
        } else if (ant.behavior.type === "goToFood") {
            // С шансом 5% сойти с пути
            if (Math.random() < 0.05) {
                ant.behavior.type = "findFood";
            } else {
                nextStep = goToAttractiveCell(ant, availableCells, "food");

                // Не нашли еду, а значит начать новый поиск еды
                if (!nextStep) {
                    ant.behavior.type = "findFood";
                }
            }
        }

        if (ant.behavior.type === "findFood" || ant.behavior.type === "chaos") {
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
