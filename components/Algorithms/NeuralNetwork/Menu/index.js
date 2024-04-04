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
    setIsFixed,
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

        let image1 = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data1 = image1.data;
        
        let left = canvas.width;
        let right = 0; 
        let top = canvas.height;
        let bottom = 0;

        for (let i = 0; i < data1.length; i += 4) {
            let value = 0;
            for (let j = 0; j < 3; j++) {
                value += data1[i + j];
            }
            value /= 3;

            if (value / 255 > 0) {
                const newX = i / 4 % canvas.width;
                const newY = Math.floor(i / 4 / canvas.width);

                if (newX < left) left = newX;
                if (newX > right) right = newX;
                if (newY < top) top = newY ;
                if (newY > bottom) bottom = newY ;
            }
        }

        console.log(left);
        console.log(right);
        console.log(top);
        console.log(bottom);

        const originWidth = Math.abs(left - right);
        const originHeight = Math.abs(bottom - top);
        
        console.log(originHeight);
        console.log(originWidth);
        
        const ratio = Math.max(originHeight, originWidth) / 32;

        const newHeight = originHeight / ratio;
        const newWidth = originWidth / ratio;

        const startX = (50 - newWidth) / 2;
        const startY = (50 - newHeight) / 2;

        const hiddenCanvas = document.createElement("canvas");
        hiddenCanvas.style.display = "block";
        hiddenCanvas.style.backgroundColor = "grey";
        hiddenCanvas.width = 50;
        hiddenCanvas.height = 50;
        document.body.appendChild(hiddenCanvas);
        const hiddenCtx = hiddenCanvas.getContext("2d");

        hiddenCtx.drawImage(canvas, left, top, originWidth, originHeight, startX, startY, newWidth, newHeight);
        
        let image = hiddenCtx.getImageData(0, 0, canvas.width, canvas.height);
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
        console.log(pixels);
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
