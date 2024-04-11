import Button from "../../../Button";
import Status from "../../../Status";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import { readFile } from "../../../../utils/helpers";
import ButtonContainer from "../../../ButtonContainer";
import { convertCSVtoJSON } from "../../../../utils/helpers";

export default function Menu({
    isOptimized,
    setIsOptimized,
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

    // Изменить оптимизацию дерева решений
    const changeOptimizeOfDecisionTree = () => {
        setIsOptimized(!isOptimized);
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
                    onClick={changeOptimizeOfDecisionTree}
                    disabled={!trainingSet || processIsActive}
                >
                    {isOptimized ? "Ликвидировать" : "Оптимизировать"}
                </Button>
            </ButtonContainer>

            <ButtonContainer>
                <Button
                    type="primary"
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
