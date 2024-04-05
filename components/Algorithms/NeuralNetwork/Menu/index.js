import { useState } from "react";
import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import { sleep } from "../../../../utils/helpers";
import { feedForward, backpropagation } from "../Utils/neuralNetwork";

export default function Menu({
    NN,
    canvas,
    ctx,
    hiddenCanvas,
    hiddenCtx,
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
        if (hiddenCtx) {
            hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        }
    }

    // Получить правильную цифру
    const getCorrectDigit = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setCorrectDigit(Number(value));
    }

    // Изменить веса, если нейросеть не распознала цифру
    const newBackpropagation = async () => {
        setIsFixed(1);

        const targets = new Array(10).fill(0);
        targets[correctDigit] = 1;

        backpropagation(NN, targets);

        await sleep(0);

        fetch("/api/neyro", {
            method: "POST",
            body: JSON.stringify(NN)
        });

        setIsFixed(2);
    }

    const getDigit = () => {
        setIsFixed(false);

        const firstImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const firstData = firstImage.data;

        let left = canvas.width;
        let right = 0; 
        let top = canvas.height;
        let bottom = 0;

        for (let i = 0; i < firstData.length; i += 4) {
            let value = 0;
            for (let j = 0; j < 3; j++) {
                value += firstData[i + j];
            }
            value /= 3;

            if (value / 255 > 0) {
                const newX = i / 4 % canvas.width;
                const newY = Math.floor(i / 4 / canvas.width);

                if (newX < left) left = newX;
                if (newX > right) right = newX;
                if (newY < top) top = newY;
                if (newY > bottom) bottom = newY;
            }
        }

        const originWidth = Math.abs(left - right);
        const originHeight = Math.abs(bottom - top);

        const ratio = Math.max(originHeight, originWidth) / 40;

        const newHeight = originHeight / ratio;
        const newWidth = originWidth / ratio;

        const startX = (50 - newWidth) / 2;
        const startY = (50 - newHeight) / 2;

        hiddenCtx.drawImage(canvas, left, top, originWidth, originHeight, startX, startY, newWidth, newHeight);

        const secondImage = hiddenCtx.getImageData(0, 0, canvas.width, canvas.height);
        const secondData = secondImage.data;

        const pixels = [];
        for (let i = 0; i < secondData.length; i += 4) {
            pixels.push(
                Math.pow(secondData[i + 3] / 255, 1 / Math.pow(ratio, 2))
            );
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

            {isFixed > 0 && (
                <span className={`${style.status} ${isFixed === 2 ? style.success : ""}`}>
                    {isFixed === 1 ? (
                        "Пожалуйста, подождите..."
                    ) : (
                        "Спасибо, Ваше мнение учтено!"
                    )}
                </span>
            )}
        </MenuWrapper>
    );
}
