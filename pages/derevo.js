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

    // Запущен ли процесс поиска решения
    const [processIsActive, setProcessIsActive] = useState(false);

    // Результат предсказания
    const [prediction, setPrediction] = useState();

    // Пройденные узлы (для очистки)
    const [passedNodes, setPassedNodes] = useState([]);

    // Перезагрузить дерево решений при изменении выборки
    useEffect(() => {
        if (!trainingSet) {
            setDecisionTree();
            setPrediction();
            setPassedNodes([]);

            return;
        }

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

        setProcessIsActive(true);

        // Убрать выделение у предыдущего предсказания
        passedNodes.forEach((decisionNode) => {
            if (decisionNode.category) {
                decisionNode.categoryHighlighted = false;
            } else {
                decisionNode.questionHighlighted = false;
                decisionNode.yesHighlighted = false;
                decisionNode.noHighlighted = false;
            }
        });

        predict(decisionTree, fieldForPrediction, {
            setDecisionTree,
            setProcessIsActive,
            setPrediction,
            setPassedNodes
        });
    }, [fieldForPrediction]);

    return (
        <>
            <Menu
                maxDepth={maxDepth}
                setMaxDepth={setMaxDepth}
                trainingSet={trainingSet}
                setTrainingSet={setTrainingSet}
                setFieldForPrediction={setFieldForPrediction}
                processIsActive={processIsActive}
                prediction={prediction}
                setPrediction={setPrediction}
            />

            <Screen
                decisionTree={decisionTree}
            />
        </>
    );
}
