import { useState } from "react";
import Input from "../../../Input";
import Button from "../../../Button";
import Status from "../../../Status";
import MenuWrapper from "../../../MenuWrapper";
import ButtonContainer from "../../../ButtonContainer";

export default function Menu({
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
        setIsFixed(0);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (hiddenCtx) {
            hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
        }
    }

    // Изменить веса, если нейросеть не распознала цифру
    const newBackpropagation = async () => {
        setIsFixed(1);

        await fetch("/api/neyro/correct", {
            method: "POST",
            body: correctDigit
        });

        setIsFixed(2);
    }

    const getDigit = async () => {
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

        let digit = 0;

        try {
            const response = await fetch("/api/neyro/predict", {
                method: "POST",
                body: JSON.stringify(pixels)
            });

            digit = await response.json();
        } catch (error) {
            console.error(error);
        }

        setCondition(true);
        setDigit(digit);
        setCorrectDigit(digit);
    };

    return (
        <MenuWrapper
            title="Нейронная сеть"
            description="Сейчас вы узрите, как работает нейронная сеть IS Empire."
        >
            <ButtonContainer>
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
            </ButtonContainer>

            <Status type={Number(condition)}>
                {condition ? (
                    `Вы нарисовали цифру: ${digit}`
                ) : (
                    "Нарисуйте Вашу цифру!"
                )}
            </Status>

            <Input
                label="Правильная цифра"
                description="Введите правильную цифру"
                isNumber={true}
                max={9}
                value={correctDigit}
                setValue={setCorrectDigit}
                disabled={!condition || isFixed}
            />

            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={newBackpropagation}
                    disabled={!condition || isFixed}
                >
                    Исправить
                </Button>
            </ButtonContainer>

            <Status type={Number(isFixed === 2)}>
                {!!isFixed && (
                    isFixed === 1 ? (
                        "Пожалуйста, подождите..."
                    ) : (
                        "Спасибо, Ваше мнение учтено!"
                    )
                )}
            </Status>
        </MenuWrapper>
    );
}
