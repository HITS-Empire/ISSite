import { useState } from "react";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";

export default function Menu({
    canvas,
    ctx,
    NN
}) {
    const refreshCanvas = () => {
        setCondition(false);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const [condition, setCondition] = useState(false);
    const [digit, setDigit] = useState(0);

    const getDigit = () => {
        let image = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = image.data;

        const pixels = [];
        
        for (let i = 3; i < data.length; i += 4) {
            pixels.push(data[i] / 255);
        }

        const output = NN.feedForward(pixels);
        
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
                <span className={style.status}>
                    Вы ввели цифру: {digit}
                </span>
            )}

        </MenuWrapper>
    );
}
