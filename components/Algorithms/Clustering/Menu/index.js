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

}
