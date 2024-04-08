import { useState } from "react";
import style from "./style.module.scss";

export default function Screen({
    decisionTree,
    processIsActive,
    marginTop,
    setMarginTop,
    marginLeft,
    setMarginLeft,
    savedMarginTop,
    setSavedMarginTop,
    savedMarginLeft,
    setSavedMarginLeft
}) {
    // Стартовая точка перемещения
    const [moveScreenStartPoint, setMoveScreenStartPoint] = useState();

    // Начать перемещение экрана
    const moveScreenStart = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;

        setMoveScreenStartPoint({ x: offsetX, y: offsetY });
    };

    // Закончить перемещение экрана
    const moveScreenEnd = () => {
        setMoveScreenStartPoint();
        setSavedMarginTop(marginTop);
        setSavedMarginLeft(marginLeft);
    };

    // Само перемещение экрана
    const moveScreen = (event) => {
        if (!moveScreenStartPoint) return;

        const { offsetX, offsetY } = event.nativeEvent;

        setMarginTop(savedMarginTop + offsetY - moveScreenStartPoint.y);
        setMarginLeft(savedMarginLeft + offsetX - moveScreenStartPoint.x);
    };

    // Рекурсивное преобразование дерева в HTML-граф
    const getDecisionTreeComponent = (decisionNode) => {
        if (decisionNode.prediction) {
            const predictionComponent = (
                <span
                    id={decisionNode.id}
                    className={decisionNode.predictionHighlighted ? style.highlighted : ""}
                >
                    {decisionNode.prediction}
                </span>
            );

            return (
                <ul>
                    <li className={style.prediction}>
                        {predictionComponent}
                    </li>
                </ul>
            );
        }

        const questionComponent = (
            <span
                id={decisionNode.id}
                className={decisionNode.questionHighlighted ? style.highlighted : ""}
            >
                {decisionNode.expression}
            </span>
        );

        const noComponent = (
            <span
                className={`${style.no} ${decisionNode.noHighlighted ? style.highlighted : ""}`}
            >
                Нет ({decisionNode.noNodesCount})
            </span>
        );

        const yesComponent = (
            <span
                className={`${style.yes} ${decisionNode.yesHighlighted ? style.highlighted : ""}`}
            >
                Да ({decisionNode.yesNodesCount})
            </span>
        );

        return (
            <ul>
                <li>
                    {questionComponent}
                    <ul>
                        <li>
                            {noComponent}
                            {getDecisionTreeComponent(decisionNode.noNodes)}
                        </li>
                        <li>
                            {yesComponent}
                            {getDecisionTreeComponent(decisionNode.yesNodes)}
                        </li>
                    </ul>
                </li>
            </ul>
        );
    };

    // Визуализация дерева решений
    const decisionTreeComponent = decisionTree && getDecisionTreeComponent(decisionTree);

    return (
        <div id="tree" className={style.screen}>
            <div
                className={style.handler}
                onMouseDown={moveScreenStart}
                onMouseUp={moveScreenEnd}
                onMouseOut={moveScreenEnd}
                onMouseMove={moveScreen}
                active={String(!processIsActive)}
            />
            <div
                className={style.tree}
                style={{
                    margin: `${marginTop}px 0 0 ${marginLeft}px`,
                    transition: processIsActive && "margin 0.4s"
                }}
            >
                {decisionTreeComponent}
            </div>
        </div>
    );
}
