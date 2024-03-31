import style from "./style.module.scss";

export default function Screen({
    decisionTree
}) {
    // Рекурсивное преобразование дерева в HTML-граф
    const getDecisionTreeComponent = (decisionNode) => {
        if (decisionNode.category) {
            return (
                <ul>
                    <li className={style.category}>
                        <span>{decisionNode.category}</span>
                    </li>
                </ul>
            );
        }

        return (
            <ul>
                <li>
                    <span>
                        {decisionNode.attribute} {decisionNode.predicateName} {decisionNode.pivot}
                    </span>
                    <ul>
                        <li>
                            <span className={style.no}>
                                Нет ({decisionNode.notMatchedCount})
                            </span>
                            {getDecisionTreeComponent(decisionNode.notMatch)}
                        </li>
                        <li>
                            <span className={style.yes}>
                                Да ({decisionNode.matchedCount})
                            </span>
                            {getDecisionTreeComponent(decisionNode.match)}
                        </li>
                    </ul>
                </li>
            </ul>
        );
    };

    // Визуализация дерева решений
    const decisionTreeComponent = decisionTree && getDecisionTreeComponent(decisionTree);

    return (
        <div className={style.screenContainer}>
            <div className={style.screen}>
                {decisionTreeComponent}
            </div>
        </div>
    );
}
