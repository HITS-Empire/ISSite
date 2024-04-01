// Доступные предикаты
const predicates = {
    "=": (a, b) => a == b,
    ">": (a, b) => a > b
};

// Предсказать событие
export function predict(decisionNode, field) {
    const passedNodes = [];

    while (true) {
        passedNodes.push(decisionNode);

        if (decisionNode.category) {
            decisionNode.categoryHighlighted = true;

            return {
                prediction: decisionNode.category,
                passedNodes
            };
        }

        const { predicate, pivot } = decisionNode;

        decisionNode.questionHighlighted = true;

        if (predicate(field[decisionNode.attribute], pivot)) {
            decisionNode.yesHighlighted = true;
            decisionNode = decisionNode.match;
        } else {
            decisionNode.noHighlighted = true;
            decisionNode = decisionNode.notMatch;
        }
    }
}

// Получить количество уникальных значений
export function getCountOfUniqueValues(set, attribute) {
    const counter = {};

    for (let i = set.length - 1; i >= 0; i--) {
        counter[set[i][attribute]] = 0;
    }

    for (let i = set.length - 1; i >= 0; i--) {
        counter[set[i][attribute]]++;
    }

    return counter;
}

// Получить наиболее частое совпадение
export function getMostFrequentValue(set, attribute) {
    const counter = getCountOfUniqueValues(set, attribute);

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
    const counter = getCountOfUniqueValues(set, attribute);

    let p, entropy = 0;
    for (const i in counter) {
        p = counter[i] / set.length;
        entropy += -p * Math.log(p);
    }

    return entropy;
}

// Получить разделение дерева
export function getSplit(set, attribute, predicate, pivot) {
    const match = [], notMatch = [];
      
    for (var i = set.length - 1; i >= 0; i--) {
        const field = set[i];
        const attributeValue = field[attribute];

        if (predicate(attributeValue, pivot)) {
            match.push(field);
        } else {
            notMatch.push(field);
        }
    };

    return { match, notMatch };
}

// Получить дерево решений на основе выборки
export function getDecisionTree({
    trainingSet,
    requiredAttribute,
    maxDepth = 128
}) {
    const minItemsCount = 1;
    const entropyThrehold = 0.01;

    if (maxDepth === 0 || trainingSet.length <= minItemsCount) {
        return {
            category: getMostFrequentValue(trainingSet, requiredAttribute),
            categoryHighlighted: false
        };
    }

    let initialEntropy = getEntropy(trainingSet, requiredAttribute);

    if (initialEntropy <= entropyThrehold) {
        return {
            category: getMostFrequentValue(trainingSet, requiredAttribute),
            categoryHighlighted: false
        };
    }

    const alreadyChecked = {};
    let bestSplit = { gain: 0 };

    for (let i = trainingSet.length - 1; i >= 0; i--) {
        const field = trainingSet[i];

        for (let attribute in field) {
            if (attribute === requiredAttribute) continue;

            const pivot = field[attribute];
            const predicateName = typeof pivot === "number" ? ">" : "=";
            const attributePredicatePivot = attribute + predicateName + pivot;

            if (alreadyChecked[attributePredicatePivot]) continue;

            alreadyChecked[attributePredicatePivot] = true;

            const predicate = predicates[predicateName];
            const currentSplit = getSplit(trainingSet, attribute, predicate, pivot);

            const matchEntropy = getEntropy(currentSplit.match, requiredAttribute);
            const notMatchEntropy = getEntropy(currentSplit.notMatch, requiredAttribute);

            let newEntropy = 0;
            newEntropy += matchEntropy * currentSplit.match.length;
            newEntropy += notMatchEntropy * currentSplit.notMatch.length;
            newEntropy /= trainingSet.length;

            const currentGain = initialEntropy - newEntropy;
            if (currentGain > bestSplit.gain) {
                bestSplit = currentSplit;
                bestSplit.predicateName = predicateName;
                bestSplit.predicate = predicate;
                bestSplit.attribute = attribute;
                bestSplit.pivot = pivot;
                bestSplit.gain = currentGain;
            }
        }
    }

    if (!bestSplit.gain) {
        return {
            category: getMostFrequentValue(trainingSet, requiredAttribute),
            categoryHighlighted: false
        };
    }

    maxDepth--;

    // Рекурсивно заполняем деревья-потомки
    const matchSubTree = getDecisionTree({
        trainingSet: bestSplit.match,
        requiredAttribute,
        maxDepth
    });
    const notMatchSubTree = getDecisionTree({
        trainingSet: bestSplit.notMatch,
        requiredAttribute,
        maxDepth
    });

    return {
        attribute: bestSplit.attribute,
        predicate: bestSplit.predicate,
        predicateName: bestSplit.predicateName,
        pivot: bestSplit.pivot,
        match: matchSubTree,
        notMatch: notMatchSubTree,
        matchedCount: bestSplit.match.length,
        notMatchedCount: bestSplit.notMatch.length,
        questionHighlighted: false,
        yesHighlighted: false,
        noHighlighted: false
    };
}
