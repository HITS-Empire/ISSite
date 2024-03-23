import MenuWrapper from "../../../MenuWrapper";
import Button from "../../../Button";
import style from "./style.module.scss";

export default function Menu({
    processIsActive,
    setProcessIsActive,
}) {
    // Запустить процесс нахождения пути
    const runProcess = () => {
        setProcessIsActive(true);
    };

    return (
        <MenuWrapper
            title="Алгоритм кластеризации"
            description="Сейчас вы узрите, как работает алгоритм кластеризации."
        >

        </MenuWrapper>
    );
}
