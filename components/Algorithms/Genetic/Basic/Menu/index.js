import Input from "../../../../Input";
import Button from "../../../../Button";
import MenuWrapper from "../../../../MenuWrapper";
import ButtonContainer from "../../../../ButtonContainer";
import { pathOfTravelingSalesman } from "../Utils/pathOfTravelingSalesman";

export default function Menu({
    setVertices,
    vertices,
    maxAmountOfPopulations,
    setMaxAmountOfPopulations,
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

    // Изменить количество популяций
    const changeMaxAmountOfPopulations = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setMaxAmountOfPopulations(Math.min(Math.max(value, 0), 512));
    };

    const getPathOfTravelingSalesman = () => {
        const path = pathOfTravelingSalesman(vertices, ctx, maxAmountOfPopulations);

        ctx.beginPath();
        ctx.moveTo(vertices[path[0] - 1].x, vertices[path[0] - 1].y);
        ctx.strokeStyle = 'red';
       
        for (let i = 0; i < path.length; i++) {
            ctx.lineTo(vertices[path[i] - 1].x, vertices[path[i] - 1].y);
        }
       
        ctx.closePath();
        ctx.stroke();
    }

    return (
        <MenuWrapper
            title="Генетический алгоритм"
            description="Сейчас вы узрите, как работает базовый генетический алгоритм."
        >
            <Input 
                type="text"
                label="Количество популяций"
                description="Введите количество популяций"
                value={maxAmountOfPopulations}
                onChange={changeMaxAmountOfPopulations}
            />

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
