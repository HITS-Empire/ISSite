import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";

export default function Menu({
    setVertices,
    vertices,
    setLines,
    setStop,
    canvas,
    ctx
}) {
    const refreshCanvas = () => {
        setVertices([]);
        setLines([]);
        setStop(true);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const getPathOfTravelingSalesman = () => {
        if (vertices.length === 0 || !ctx) return;

        setStop(false);
    }

    return (
        <MenuWrapper
            title="Базовый генетический алгоритм"
            description="Сейчас вы узрите, как работает алгоритм нахождения кратчайшего пути в задаче коммивояжёра."
        >
            <ButtonContainer>
                <Button
                    type="primary"
                    onClick={getPathOfTravelingSalesman}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={refreshCanvas}
                >
                    Перезагрузить
                </Button>
            </ButtonContainer>
        </MenuWrapper>
    );
}
