// Получить поле размером N x N
export function getField(count) {
    const field = [];

    for (let i = 0; i < count; i++) {
        const line = [];

        for (let j = 0; j < count; j++) {
            let cell;
            
            const isStart = !i && !j;
            const isEnd = i === count - 1 && j === count - 1;

            if (!isStart && !isEnd) {
                if (Math.random() < 0.5) {
                    cell = 0;
                } else {
                    cell = 1;
                }
            }
            if (isStart) {
                cell = 2;
            }
            if (isEnd) {
                cell = 3;
            }

            line.push(cell);
        }

        field.push(line);
    }

    return {
        field,
        startCell: {
            row: 0,
            column: 0
        },
        endCell: {
            row: count - 1,
            column: count - 1
        }
    };
}
