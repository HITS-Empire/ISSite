import style from "./style.module.scss";
import { useState, useEffect } from "react";

export default function Screen({
    decisionTree
}) {
    // Стартовая точка перемещения
    const [moveScreenStartPoint, setMoveScreenStartPoint] = useState();

    // Отступы для перемещения
    const [marginTop, setMarginTop] = useState(0);
    const [marginLeft, setMarginLeft] = useState(0);

    // Сохранённые отступы
    const [savedMarginTop, setSavedMarginTop] = useState(0);
    const [savedMarginLeft, setSavedMarginLeft] = useState(0);

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
        if (decisionNode.category) {
            const categoryComponent = (
                <span
                    className={decisionNode.categoryHighlighted ? style.highlighted : ""}
                >
                    {decisionNode.category}
                </span>
            );

            return (
                <ul>
                    <li className={style.category}>
                        {categoryComponent}
                    </li>
                </ul>
            );
        }

        const questionComponent = (
            <span
                className={decisionNode.questionHighlighted ? style.highlighted : ""}
            >
                {decisionNode.attribute} {decisionNode.predicateName} {decisionNode.pivot}
            </span>
        );

        const noComponent = (
            <span
                className={`${style.no} ${decisionNode.noHighlighted ? style.highlighted : ""}`}
            >
                Нет ({decisionNode.notMatchedCount})
            </span>
        );

        const yesComponent = (
            <span
                className={`${style.yes} ${decisionNode.yesHighlighted ? style.highlighted : ""}`}
            >
                Да ({decisionNode.matchedCount})
            </span>
        );

        return (
            <ul>
                <li>
                    {questionComponent}
                    <ul>
                        <li>
                            {noComponent}
                            {getDecisionTreeComponent(decisionNode.notMatch)}
                        </li>
                        <li>
                            {yesComponent}
                            {getDecisionTreeComponent(decisionNode.match)}
                        </li>
                    </ul>
                </li>
            </ul>
        );
    };

    // Сбросить состояния поля при перезагрузке дерева
    useEffect(() => {
        if (decisionTree) return;

        setMarginLeft(0);
        setMarginTop(0);
        setSavedMarginLeft(0);
        setSavedMarginTop(0);
    }, [decisionTree]);

    // Визуализация дерева решений
    const decisionTreeComponent = decisionTree && getDecisionTreeComponent(decisionTree);

    return (
        <div className={style.screen}>
            <div
                className={style.handler}
                onMouseDown={moveScreenStart}
                onMouseUp={moveScreenEnd}
                onMouseOut={moveScreenEnd}
                onMouseMove={moveScreen}
            />
            <div
                className={style.tree}
                style={{
                    margin: `${marginTop}px 0 0 ${marginLeft}px`
                }}
            >
                {decisionTreeComponent}
            </div>
        </div>
    );
}
