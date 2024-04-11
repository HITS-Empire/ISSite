import { useState, useEffect } from "react";
import Menu from "../components/Algorithms/DecisionTree/Menu";
import Screen from "../components/Algorithms/DecisionTree/Screen";
import {
    predict,
    getDecisionTree
} from "../components/Algorithms/DecisionTree/Utils/decisionTree";

export default function DecisionTree() {
    // Нужно ли оптимизировать дерево
    const [isOptimized, setIsOptimized] = useState(false);

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

    // Отступы для перемещения
    const [marginTop, setMarginTop] = useState(0);
    const [marginLeft, setMarginLeft] = useState(0);

    // Сохранённые отступы
    const [savedMarginTop, setSavedMarginTop] = useState(0);
    const [savedMarginLeft, setSavedMarginLeft] = useState(0);

    // Перезагрузить дерево решений при изменении выборки
    useEffect(() => {
        setMarginLeft(0);
        setMarginTop(0);
        setSavedMarginLeft(0);
        setSavedMarginTop(0);

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
                isOptimized
            })
        );
    }, [isOptimized, trainingSet]);

    // Сбросить состояния поля при перезагрузке дерева
    useEffect(() => {
        if (decisionTree) return;

        setIsOptimized(false);
        setMarginLeft(0);
        setMarginTop(0);
        setSavedMarginLeft(0);
        setSavedMarginTop(0);
    }, [decisionTree]);

    // Сделать предсказание
    useEffect(() => {
        if (!fieldForPrediction) return;

        setPrediction();
        setProcessIsActive(true);

        // Убрать выделение у предыдущего предсказания
        passedNodes.forEach((decisionNode) => {
            if (decisionNode.prediction) {
                decisionNode.predictionHighlighted = false;
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
            setPassedNodes,
            marginTop,
            setMarginTop,
            marginLeft,
            setMarginLeft
        });
    }, [fieldForPrediction]);

    // Сохранить отступы после завершения процесса
    useEffect(() => {
        if (processIsActive) return;

        setSavedMarginTop(marginTop);
        setSavedMarginLeft(marginLeft);
    }, [processIsActive]);

    return (
        <>
            <Menu
                isOptimized={isOptimized}
                setIsOptimized={setIsOptimized}
                trainingSet={trainingSet}
                setTrainingSet={setTrainingSet}
                setFieldForPrediction={setFieldForPrediction}
                processIsActive={processIsActive}
                prediction={prediction}
                setPrediction={setPrediction}
            />

            <Screen
                decisionTree={decisionTree}
                processIsActive={processIsActive}
                marginTop={marginTop}
                setMarginTop={setMarginTop}
                marginLeft={marginLeft}
                setMarginLeft={setMarginLeft}
                savedMarginTop={savedMarginTop}
                setSavedMarginTop={setSavedMarginTop}
                savedMarginLeft={savedMarginLeft}
                setSavedMarginLeft={setSavedMarginLeft}
            />
        </>
    );
}
