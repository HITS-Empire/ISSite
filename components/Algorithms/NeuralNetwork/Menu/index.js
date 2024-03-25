import MenuWrapper from "../../../MenuWrapper";
import Button from "../../../Button";
import style from "./style.module.scss"

export default function Menu({
    canvas,
    ctx
}) {

    const refreshCanvas = () => {

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return (
        <MenuWrapper
            title="Нейронная сеть"
            description="Сейчас вы узрите, как работает нейронная сеть IS Empire."
        >
            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={refreshCanvas}
                >
                    Очистить
                </Button>
            </div>
        </MenuWrapper>
    );
}
