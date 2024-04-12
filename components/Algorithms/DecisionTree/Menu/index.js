import Input from "../../../Input";
import Button from "../../../Button";
import Status from "../../../Status";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import { readFile } from "../../../../utils/helpers";
import ButtonContainer from "../../../ButtonContainer";
import { convertCSVtoJSON } from "../../../../utils/helpers";

export default function Menu({
    optimizationPercentage,
    setOptimizationPercentage,
    trainingSet,
    setTrainingSet,
    setFieldForPrediction,
    processIsActive,
    prediction,
    setPrediction
}) {
    // Добавить новую обучающую выборку
    const addTrainingSet = async (event) => {
        const file = event.target.files[0];
        event.target.value = null;

        try {
            const content = await readFile(file);
            const array = convertCSVtoJSON(content);

            setTrainingSet(array);
        } catch (error) {
            console.error(error);
        }
    };

    // Добавить данные для предсказания
    const addFieldForPrediction = async (event) => {
        const file = event.target.files[0];
        event.target.value = null;

        try {
            const content = await readFile(file);
            const array = convertCSVtoJSON(content);

            setFieldForPrediction(array[0]);
        } catch (error) {
            console.error(error);
        }
    };

    // Очистить дерево решений
    const clearDecisionTree = () => {
        setTrainingSet();
        setFieldForPrediction();
        setPrediction();
    };

    // Изменить процент оптимизации
    const changeOptimizationPercentageEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setOptimizationPercentage(Math.min(Math.max(value, 0), 100));
    };

    return (
        <MenuWrapper
            className={style.menu}
            title="Дерево решений"
            description="Сейчас вы узрите, как работают предсказания на основе обучающих данных."
        >
            <ButtonContainer>
                <Button
                    type="primary"
                    onChange={addTrainingSet}
                    disabled={trainingSet}
                    input={{
                        id: "addTrainingSet",
                        type: "file",
                        accept: ".csv"
                    }}
                >
                    Добавить выборку
                </Button>

                <Button
                    type="soft"
                    onChange={addFieldForPrediction}
                    disabled={!trainingSet || processIsActive}
                    input={{
                        id: "addFieldForPrediction",
                        type: "file",
                        accept: ".csv"
                    }}
                >
                    Предсказать событие
                </Button>
            </ButtonContainer>

            <Input
                type="text"
                label="Процент оптимизации"
                description="Введите процент оптимизации"
                value={optimizationPercentage}
                disabled={!trainingSet || processIsActive}
                onChange={changeOptimizationPercentageEvent}
            />

            <ButtonContainer>
                <Button
                    type="soft"
                    onClick={clearDecisionTree}
                    disabled={processIsActive}
                >
                    Очистить
                </Button>
            </ButtonContainer>

            <Status type={1}>
                {prediction && `Результат: ${prediction}`}
            </Status>
        </MenuWrapper>
    );
}
