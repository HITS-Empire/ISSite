import {
    feedForward,
    backpropagation,
    saveBiasesToFile,
    saveWeightsToFile,
    saveNeuronsToFile 
} from "../Utils/neuralNetwork";
import { useState } from "react";
import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";

export default function Menu({
    NN,
    canvas,
    ctx,
    condition,
    setCondition,
    correctDigit,
    setCorrectDigit,
    isFixed,
    setIsFixed
}) {
    const [digit, setDigit] = useState(0);

    const refreshCanvas = () => {
        setCondition(false);
        setCorrectDigit(0);
        setIsFixed(false);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Получить правильную цифру
    const getCorrectDigit = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setCorrectDigit(Number(value));
    }

    // Изменить веса, если нейросеть не распознала цифру
    const newBackpropagation = () => {
        setIsFixed(true);

        const targets = new Array(10).fill(0);
        targets[correctDigit] = 1;

        backpropagation(NN, targets);

        return; // Не сохранять, пока не исправлена запись в файл

        saveWeightsToFile(NN, "weights.json");
        saveNeuronsToFile(NN, "neurons.json");
        saveBiasesToFile(NN, "biases.json");
    }

    const getDigit = () => {
        setIsFixed(false);

        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = image.data;

        const pixels = [];
        for (let i = 0; i < data.length; i += 4) {
            let value = 0;
            for (let j = 0; j < 3; j++) {
                value += data[i + j];
            }
            value /= 3;
    
            pixels.push(value / 255);
        }
        
        const output = feedForward(NN, pixels);
        
        let endDigit = 0;
        let endDigitWeight = -1;

        for (let i = 0; i < 10; i++) {
            if (endDigitWeight < output[i]) {
                endDigitWeight = output[i];
                endDigit = i;
            }
        }

        setCondition(true);
        setDigit(endDigit);
        setCorrectDigit(endDigit);
    };

    return (
        <MenuWrapper
            title="Нейронная сеть"
            description="Сейчас вы узрите, как работает нейронная сеть IS Empire."
        >
            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={getDigit}
                >
                    Распознать
                </Button>

                <Button
                    type="soft"
                    onClick={refreshCanvas}
                >
                    Очистить
                </Button>
            </div>

            <span className={`${style.status} ${condition ? style.success : ""}`}>
                {condition ? (
                    `Вы нарисовали цифру: ${digit}`
                ) : (
                    "Нарисуйте Вашу цифру!"
                )}
            </span>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="Правильная цифра"
                    description="Введите правильную цифру"
                    value={correctDigit}
                    onChange={getCorrectDigit}
                    disabled={!condition || isFixed}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={newBackpropagation}
                    disabled={!condition || isFixed}
                >
                    Исправить
                </Button>
            </div>

            {isFixed && (
                <span className={`${style.status} ${style.success}`}>
                    Спасибо, Ваше мнение учтено!
                </span>
            )}
        </MenuWrapper>
    );
}
