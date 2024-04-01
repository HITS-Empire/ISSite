import Input from "../../../Input";
import { WARD } from "../Utils/WARD";
import Button from "../../../Button";
import style from "./style.module.scss";
import { kMeans } from "../Utils/kMeans";
import { DBSCAN } from "../Utils/DBSCAN";
import MenuWrapper from "../../../MenuWrapper";

export default function Menu({
    points,
    setPoints,
    canvas,
    ctx,
    clusters,
    setClusters,
    radius,
    setRadius,
    minAmount,
    setMinAmount,
}) {
    // Изменить количество кластеров
    const changeAmountOfClusters = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setClusters(Math.min(Math.max(value, 0), 32));
    };

    // Изменить радиус поиска
    const changeRadius = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setRadius(Math.min(Math.max(value, 0), 2048));
    }

    // Изменить минимальное количество
    const changeMinAmount = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setMinAmount(Math.min(Math.max(value, 0), 1024));
    };

    // Функция для определения цвета 
    const randomColor = () => {
        const red = Math.floor(Math.random() * 128) + 128; // Генерация красного цвета от 128 до 255
        const green = Math.floor(Math.random() * 128) + 128; // Генерация зеленого цвета от 128 до 255
        const blue = Math.floor(Math.random() * 128) + 128; // Генерация синего цвета от 128 до 255

        return `rgb(${red}, ${green}, ${blue})`;
    }
    
    // Раскрашивание кластеров
    const drawClusters = () => {
        const clustersKMeans = kMeans(points, clusters);
        const clustersDBSCAN = DBSCAN(points, radius, minAmount);
        const clustersWARD = WARD(points, clusters);

        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        clustersWARD.forEach((cluster) => {
            const color = randomColor();

            cluster.points.sort(( first, second) => first.x - second.x);
            cluster.points.sort(( first, second) => first.x - second.x || first.y - second.y);

            ctx.globalAlpha = 0;
            ctx.beginPath();
            ctx.strokeStyle = color;
            cluster.points.forEach((point) => {
                ctx.lineTo(point.x, point.y, color);
            });
            
            ctx.globalAlpha = 0.5;
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        clustersDBSCAN.forEach((cluster) => {
            const color = randomColor();

            cluster.points.sort(( first, second) => first.x - second.x);
            cluster.points.sort(( first, second) => first.x - second.x || first.y - second.y);

            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            cluster.points.forEach((point) => {
                ctx.lineTo(point.x, point.y, color);
            });

            ctx.closePath();
            ctx.stroke();
        });

        clustersKMeans.forEach((cluster) => {
            const color = randomColor();

            ctx.fillStyle = color;

            cluster.points.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
                ctx.fill();
            });        
        });
    }

    // Обновить поле
    const refreshCanvas = () => {
        setPoints([]);

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    return (
        <MenuWrapper
            title="Алгоритм кластеризации"
            description="Сейчас вы узрите, как работает алгоритм кластеризации."
        >
            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="kMeans и WARD: Количество кластеров"
                    description="Введите количество кластеров"
                    value={clusters}
                    onChange={changeAmountOfClusters}
                />
            </div>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="DBSCAN: Радиус поиска"
                    description="Введите радиус поиска"
                    value={radius}
                    onChange={changeRadius}
                />
            </div>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="DBSCAN: Количество точек в радиусе"
                    description="Введите количество точек в радиусе"
                    value={minAmount}
                    onChange={changeMinAmount}
                />
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={drawClusters}
                >
                    Запустить
                </Button>

                <Button
                    type="soft"
                    onClick={refreshCanvas}
                >
                    Перезагрузить
                </Button>
            </div>
        </MenuWrapper>
    );
}
