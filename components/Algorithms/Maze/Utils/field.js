// Получить поле размером N x N
export function getField(count) {
    const field = [];

    for (let i = 0; i < count; i++) {
        const line = [];

        for (let j = 0; j < count; j++) {
            const isStart = !i && !j;
            const isEnd = i === count - 1 && j === count - 1;

            const cell = {
                isBarrier: !isStart && !isEnd && Math.random() < 0.5,
                isStart,
                isEnd
            };

            line.push(cell);
        }

        field.push(line);
    }

    return field;
}
