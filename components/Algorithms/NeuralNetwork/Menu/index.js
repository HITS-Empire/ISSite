import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import { NeuralNetwork } from "../Utils/NeuralNetwork"
import { useState } from "react";

export default function Menu({
    canvas,
    ctx
}) {
    const refreshCanvas = () => {
        setCondition(false);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const [condition, setCondition] = useState(false);
    const [digit, setDigit] = useState(0);

    // Создать нейросеть
    const sigmoid = (x) => 1 / (1 + Math.exp(-x));
    const dsigmoid = (y) => y * (1 - y);
    const nn = new NeuralNetwork(0.01, sigmoid, dsigmoid, 2500, 1000, 200, 10);

    const getDigit = () => {
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = image.data;

        const pixels = [];
        
        for (let i = 0; i < data.length; i += 4) {
            const value = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            if (value > 0) {
                pixels.push(1);
            } else {
                pixels.push(0);
            }
        }

        const output = nn.feedForward(pixels);
        
        let endDigit = 0;
        let endDigitWeight = -1;

        for (let i = 0; i < 10; i++) {
            if (output[i] > endDigitWeight) {
                endDigitWeight = output[i];
                endDigit = i;
            }
        }
        
        setCondition(true);
        setDigit(endDigit);
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
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={refreshCanvas}
                >
                    Очистить
                </Button>
            </div>

            {condition && (
                <span className={`${style.status}`}>
                    {digit}
                </span>
            )}

        </MenuWrapper>
    );
}
