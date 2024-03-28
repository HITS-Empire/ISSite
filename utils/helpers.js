// Получить случайное число, близкое к 1
export function getNearRandom() {
    return Math.sin(Math.acos(Math.random()));
}

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
