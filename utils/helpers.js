// Кавычки с начала строки
const expressionQuotesFromStart = /^"*/;

// Кавычки с конца строки
const expressionQuotesFromEnd = /"*$/;

// Скопировать переменную
export function copy(value) {
    if (Array.isArray(value)) {
        return value.map((item) => copy(item));
    }

    if (typeof value === "object") {
        const newObject = {};

        for (const key in value) {
            newObject[key] = copy(value[key]);
        }

        return newObject;
    }

    return value;
}

// Получить случайное число, близкое к 1
export function getNearRandom() {
    return Math.sin(Math.acos(Math.random()));
}

// Получить случайное целое число в интервале от 0 до N
export function getRandomNumber(number) {
    return Math.floor(Math.random() * number);
}

// Получить случайный индекс массива
export function getRandomIndex(array) {
    return array ? getRandomNumber(array.length) : -1;
}

// Получить случайный элемент массива
export function getRandomElement(array) {
    return array?.[getRandomIndex(array)];
}

// Задержаться на какое-то время (в мс)
export async function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

// Прочитать файл
export async function readFile(file) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();

        fileReader.onload = (event) => {
            resolve(event.target.result);
        };

        fileReader.readAsText(file);
    });
}

// Разбить строку в формате CSV на поля
export function splitCSVLine(line) {
    let words = [];

    let targetQuotesCount = 0;

    line.split(/[,;\n\t]/g).forEach((word) => {
        const quotesFromStartCount = word.match(expressionQuotesFromStart)[0].length;
        const quotesFromEndCount = word.match(expressionQuotesFromEnd)[0].length;

        if (!targetQuotesCount) {
            targetQuotesCount = quotesFromStartCount;
            words.push("");
        }

        words[words.length - 1] += word;

        if (targetQuotesCount === quotesFromEndCount) {
            targetQuotesCount = 0;
        } else {
            words[words.length - 1] += ",";
        }
    });

    // Убрать служебные кавычки, привести к нужным типам
    words = words.map((word) => {
        if (word[0] === "\"") {
            word = word.slice(1, -1);
        }

        if (!isNaN(word)) {
            word = Number(word);
        }

        return word;
    });

    return words;
}

// Преобразовать файл CSV в JSON
export function convertCSVtoJSON(content) {
    const lines = content.split("\r\n");
    const keys = splitCSVLine(lines[0]);
    const array = [];

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;

        const values = splitCSVLine(lines[i]);
        const row = {};

        for (let j = 0; j < keys.length; j++) {
            row[keys[j]] = values[j];
        }

        array.push(row);
    }

    return array;
}
