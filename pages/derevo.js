import { useState } from "react";
import Menu from "../components/Algorithms/DecisionTree/Menu";
import Screen from "../components/Algorithms/DecisionTree/Screen";
import {
    predict,
    getDecisionTree
} from "../components/Algorithms/DecisionTree/Utils/decisionTree";

export default function DecisionTree() {
    const [maxDepth, setMaxDepth] = useState(128);

    const trainingSet = [
        { hairLength: 0, weight: 250, age: 36, sex: "male" },
        { hairLength: 10, weight: 150, age: 34, sex: "female" },
        { hairLength: 2, weight: 90, age: 10, sex: "male" },
        { hairLength: 6, weight: 78, age: 8, sex: "female" },
        { hairLength: 4, weight: 20, age: 1, sex: "female" },
        { hairLength: 1, weight: 170, age: 70, sex: "male" },
        { hairLength: 8, weight: 160, age: 41, sex: "female" },
        { hairLength: 10, weight: 180, age: 38, sex: "male" },
        { hairLength: 6, weight: 200, age: 45, sex: "male" }
    ];
    const requiredAttribute = "sex";

    const decisionTree = getDecisionTree({ trainingSet, requiredAttribute });

    const result = predict(
        decisionTree,
        { hairLength: 80, weight: 90, age: 38 }
    );
    console.log(result);

    return (
        <>
            <Menu
                maxDepth={maxDepth}
                setMaxDepth={setMaxDepth}
            />

            <Screen />
        </>
    );
}
