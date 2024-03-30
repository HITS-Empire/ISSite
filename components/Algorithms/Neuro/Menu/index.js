import { useState } from "react";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import Input from "../../../Input";
import { 
    backpropagation, feedForward, saveWeightsToFile, saveBiasesToFile, saveNeuronsToFile 
} from "../Utils/NeuralNetwork";

export default function Menu({
    canvas,
    ctx,
    NN,
    correctDigit,
    setCorrectDigit
}) {
    const refreshCanvas = () => {
        setCondition(false);
        setCorrectDigit();

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Получить правильную цифру
    const getCorrectDigit = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setCorrectDigit(Math.min(Math.max(value, 0), 9));
    }

    // Изменить веса, если нейросеть не распознала цифру
    const newBackpropagation = () => {
        const targets = new Array(10).fill(0);
        targets[correctDigit] = 1;

        NN = backpropagation(NN, targets);

        // Сохранить веса
        saveWeightsToFile(NN, "weights.json");

        // Сохранить нейроны 
        saveNeuronsToFile(NN, "neurons.json");

        // Сохранить биасы
        saveBiasesToFile(NN, "biases.json");
    } 

    const [condition, setCondition] = useState(false);
    const [digit, setDigit] = useState(0);

    const getDigit = () => {
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

            {condition &&  (
                <>
                    <span className={style.status}>
                        Вы ввели цифру: {digit}
                    </span>

                    <div className={style.inputContainer}>
                        <Input
                            type="text"
                            label="Введите правильную цифру"
                            description="Введите правильную цифру"
                            value={correctDigit}
                            onChange={getCorrectDigit}
                        />
                    </div>

                    <div className={style.buttonContainer}>
                        <Button
                            type="primary"
                            onClick={newBackpropagation}
                        >
                            Изменить веса
                        </Button>
                    </div>
                </>
            )}
        </MenuWrapper>
    );
}
