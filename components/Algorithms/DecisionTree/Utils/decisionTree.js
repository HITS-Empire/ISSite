import { sleep } from "../../../../utils/helpers";

// Доступные условия
const conditions = {
    "=": (a, b) => a == b,
    ">": (a, b) => a > b
};

// Предсказать событие
export async function predict(decisionTree, field, {
    setDecisionTree,
    setProcessIsActive,
    setPrediction,
    setPassedNodes,
    marginTop,
    setMarginTop,
    marginLeft,
    setMarginLeft
}) {
    let decisionNode = decisionTree;
    const passedNodes = [];

    const parentElement = document.getElementById("tree");
    const {
        x: parentX,
        y: parentY,
        width: parentWidth,
        height: parentHeight
    } = parentElement.getBoundingClientRect();

    while (true) {
        const childElement = document.getElementById(decisionNode.id);
        const { x, y, width, height } = childElement.getBoundingClientRect();

        marginTop = marginTop + parentY - y + (parentHeight - height) / 2;
        marginLeft = marginLeft + parentX - x + (parentWidth - width) / 2;

        setMarginTop(marginTop);
        setMarginLeft(marginLeft);

        passedNodes.push(decisionNode);

        if (decisionNode.prediction) {
            decisionNode.predictionHighlighted = true;

            setDecisionTree({ ...decisionTree });
            await sleep(400);

            setProcessIsActive(false);
            setPrediction(decisionNode.prediction);
            setPassedNodes(passedNodes);

            return;
        }

        const { condition, value } = decisionNode;
        decisionNode.questionHighlighted = true;

        if (conditions[condition](field[decisionNode.attribute], value)) {
            decisionNode.yesHighlighted = true;
            decisionNode = decisionNode.yesNodes;
        } else {
            decisionNode.noHighlighted = true;
            decisionNode = decisionNode.noNodes;
        }

        setDecisionTree({ ...decisionTree });
        await sleep(400);
    }
}

// Получить счётчик уникальных значений
export function getCounterOfUniqueValues(set, attribute) {
    const counter = {};

    for (const field of set) {
        if (counter[field[attribute]]) {
            counter[field[attribute]]++;
        } else {
            counter[field[attribute]] = 1;
        }
    }

    return counter;
}

// Получить наиболее частое совпадение
export function getMostFrequentValue(set, attribute) {
    const counter = getCounterOfUniqueValues(set, attribute);

    let mostFrequentValue, mostFrequentCount = 0;

    for (const value in counter) {
        if (counter[value] > mostFrequentCount) {
            mostFrequentCount = counter[value];
            mostFrequentValue = value;
        }
    };

    return mostFrequentValue;
}

// Получить значение энтропии
export function getEntropy(set, attribute) {
    const counter = getCounterOfUniqueValues(set, attribute);
    let entropy = 0;

    for (const i in counter) {
        const k = counter[i] / (set.length + 1);
        entropy += -k * Math.log(k);
    }

    return entropy;
}

// Получить разделение дерева
export function getSplit(set, attribute, condition, value) {
    const noNodes = [], yesNodes = [];
      
    for (var i = set.length - 1; i >= 0; i--) {
        const field = set[i];
        const attributeValue = field[attribute];

        if (conditions[condition](attributeValue, value)) {
            yesNodes.push(field);
        } else {
            noNodes.push(field);
        }
    };

    return { noNodes, yesNodes };
}

// Получить узел с решением
export function getPredictionNode(trainingSet, requiredAttribute, currentNode) {
    return {
        prediction: getMostFrequentValue(trainingSet, requiredAttribute),
        predictionHighlighted: false,
        id: `node-${currentNode.id++}`
    };
}

// Получить дерево решений на основе выборки
export function getDecisionTree({
    trainingSet,
    requiredAttribute,
    optimizationPercentage = 0,
    currentNode = { id: 0 }
}) {
    if (trainingSet.length <= 1) {
        return getPredictionNode(trainingSet, requiredAttribute, currentNode);
    }

    const counter = getCounterOfUniqueValues(trainingSet, requiredAttribute);
    if (Object.keys(counter).length <= 1) {
        return getPredictionNode(trainingSet, requiredAttribute, currentNode);
    }

    const initialEntropy = getEntropy(trainingSet, requiredAttribute);

    const alreadyChecked = {};
    let bestSplit = { profit: 0 };

    for (const field of trainingSet) {
        for (const attribute in field) {
            if (attribute === requiredAttribute) continue;

            const value = field[attribute];
            const condition = typeof value === "number" ? ">" : "=";
            const expression = `${attribute} ${condition} ${value}`;

            if (alreadyChecked[expression]) continue;
            alreadyChecked[expression] = true;

            const { noNodes, yesNodes } = getSplit(trainingSet, attribute, condition, value);

            const noNodesEntropy = getEntropy(noNodes, requiredAttribute);
            const yesNodesEntropy = getEntropy(yesNodes, requiredAttribute);

            const noNodesCounter = getCounterOfUniqueValues(noNodes, requiredAttribute);
            const yesNodesCounter = getCounterOfUniqueValues(yesNodes, requiredAttribute);
            const noNodesCounterLength = Object.keys(noNodesCounter).length;
            const yesNodesCounterLength = Object.keys(yesNodesCounter).length;

            const different = 1 + (
                Math.abs(
                    noNodesCounterLength / (yesNodes.length + 0.1) - yesNodesCounterLength / (noNodes.length + 0.1)
                ) - 1
            ) * (optimizationPercentage / 100);

            const newEntropy = (
                (
                    noNodesEntropy * noNodes.length
                ) + (
                    yesNodesEntropy * yesNodes.length
                )
            ) / trainingSet.length * different;

            const profit = initialEntropy - newEntropy;
            if (profit > bestSplit.profit) {
                bestSplit = {
                    noNodes,
                    yesNodes,
                    attribute,
                    condition,
                    value,
                    expression,
                    profit
                };
            }
        }
    }

    if (!bestSplit.profit) {
        return getPredictionNode(trainingSet, requiredAttribute, currentNode);
    }

    // Рекурсивно заполняем деревья-потомки
    const noNodes = getDecisionTree({
        trainingSet: bestSplit.noNodes,
        requiredAttribute,
        optimizationPercentage,
        currentNode
    });
    const yesNodes = getDecisionTree({
        trainingSet: bestSplit.yesNodes,
        requiredAttribute,
        optimizationPercentage,
        currentNode
    });

    if (noNodes.prediction !== undefined && yesNodes.prediction !== undefined) {
        if (noNodes.prediction === yesNodes.prediction) {
            return getPredictionNode(trainingSet, requiredAttribute, currentNode);
        }
    }

    return {
        attribute: bestSplit.attribute,
        condition: bestSplit.condition,
        value: bestSplit.value,
        expression: bestSplit.expression,
        noNodes,
        yesNodes,
        noNodesCount: bestSplit.noNodes.length,
        yesNodesCount: bestSplit.yesNodes.length,
        questionHighlighted: false,
        noHighlighted: false,
        yesHighlighted: false,
        id: `node-${currentNode.id++}`
    };
}
