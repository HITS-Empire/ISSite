import { useState, useEffect } from "react";
import Menu from "../components/Algorithms/DecisionTree/Menu";
import Screen from "../components/Algorithms/DecisionTree/Screen";
import {
    predict,
    getDecisionTree
} from "../components/Algorithms/DecisionTree/Utils/decisionTree";

export default function DecisionTree() {
    // Максимальная глубина дерева
    const [maxDepth, setMaxDepth] = useState(128);

    // Обучающая выборка
    const [trainingSet, setTrainingSet] = useState();

    // Данные, по которым нужно сделать предсказание
    const [fieldForPrediction, setFieldForPrediction] = useState();

    // Дерево решений
    const [decisionTree, setDecisionTree] = useState();

    // Результат предсказания
    const [prediction, setPrediction] = useState();

    // Перезагрузить дерево решений при изменении выборки
    useEffect(() => {
        if (!trainingSet) return setDecisionTree();

        let requiredAttribute;

        if (trainingSet.length) {
            for (const attribute in trainingSet[0]) {
                requiredAttribute = attribute;
            }
        }

        setDecisionTree(
            getDecisionTree({
                trainingSet,
                requiredAttribute,
                maxDepth
            })
        );
    }, [trainingSet]);

    // Сделать предсказание
    useEffect(() => {
        if (!fieldForPrediction) return;

        setPrediction(
            predict(decisionTree, fieldForPrediction)
        );
    }, [fieldForPrediction]);

    return (
        <>
            <Menu
                maxDepth={maxDepth}
                setMaxDepth={setMaxDepth}
                trainingSet={trainingSet}
                setTrainingSet={setTrainingSet}
                setFieldForPrediction={setFieldForPrediction}
                prediction={prediction}
                setPrediction={setPrediction}
            />

            <Screen
                decisionTree={decisionTree}
            />
        </>
    );
}
