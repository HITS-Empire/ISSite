// Получить случайный элемент массива
export function getRandomElement(array) {
    return array?.[Math.floor(Math.random() * array.length)];
}

// Задержаться на какое-то время (в мс)
export async function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
