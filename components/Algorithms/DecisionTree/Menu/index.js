import Input from "../../../Input";
import Button from "../../../Button";
import style from "./style.module.scss";
import MenuWrapper from "../../../MenuWrapper";
import { readFile } from "../../../../utils/helpers";
import { convertCSVtoJSON } from "../../../../utils/helpers";

export default function Menu({
    maxDepth,
    setMaxDepth,
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

    // Изменить максимальную глубину дерева
    const changeMaxDepthEvent = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setMaxDepth(Math.min(Math.max(value, 0), 1024));
    };

    return (
        <MenuWrapper
            className={style.menu}
            title="Дерево решений"
            description="Сейчас вы узрите, как работают предсказания на основе обучающих данных."
        >
            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="Максимальная глубина дерева"
                    description="Введите максимальную глубину дерева"
                    value={maxDepth}
                    disabled={trainingSet}
                    onChange={changeMaxDepthEvent}
                />
            </div>

            <div className={style.buttonContainer}>
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
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="soft"
                    onClick={clearDecisionTree}
                    disabled={processIsActive}
                >
                    Очистить
                </Button>
            </div>

            {prediction && (
                <span className={style.status}>
                    Результат: {prediction}
                </span>
            )}
        </MenuWrapper>
    );
}
