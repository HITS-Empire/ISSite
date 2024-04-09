import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";
import { pathOfTravelingSalesman } from "../Utils/pathOfTravelingSalesman";

export default function Menu({
    setVertices,
    vertices,
    setLines,
    canvas,
    ctx
}) {
    const refreshCanvas = () => {
        setVertices([]);
        setLines([]);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    const getPathOfTravelingSalesman = () => {
        const path = pathOfTravelingSalesman(vertices, ctx, canvas);
    }

    return (
        <MenuWrapper
            title="Генетический алгоритм"
            description="Сейчас вы узрите, как работает базовый генетический алгоритм."
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
