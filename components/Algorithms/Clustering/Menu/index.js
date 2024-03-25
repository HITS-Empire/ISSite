import { WARD } from "../Utils/WARD";
import Button from "../../../Button";
import style from "./style.module.scss";
import { kMeans } from "../Utils/kMeans";
import { DBSCAN } from "../Utils/DBSCAN";
import MenuWrapper from "../../../MenuWrapper";
import Input from "../../../Input";

export default function Menu({
    points,
    setPoints,
    canvas,
    ctx,
    k,
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

        setClusters(value);
    };

    // Изменить радиус поиска
    const changeRadius = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setRadius(value);
    }

    // Изменить минимальное количество
    const changeMinAmount = (event) => {
        const value = event.target.value;

        if (!/^\d*$/.test(value)) return;

        setMinAmount(value);
    };

    // Функция для определения цвета 
    const randomColor = () => {
        const red = Math.floor(Math.random() * 128) + 128; // Генерация красного цвета от 128 до 255
        const green = Math.floor(Math.random() * 128) + 128; // Генерация зеленого цвета от 128 до 255
        const blue = Math.floor(Math.random() * 128) + 128; // Генерация синего цвета от 128 до 255
        
        const color = `rgb(${red}, ${green}, ${blue})`;
        return color;
    }
    
    // Раскрашивание кластеров
    const drawClusters = () => {
        const letters = "0123456789ABCDEF";

        let clustersKMeans = kMeans(points, k);

        let clustersDBSCAN = DBSCAN(points, radius, minAmount);

        let clustersWARD = WARD(points, k);


        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        clustersWARD.forEach((cluster) => {
            let color = randomColor();;

            ctx.globalAlpha = 0;
            ctx.beginPath();
            ctx.strokeStyle = color;
            cluster.points.forEach(point => {
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
            
            ctx.beginPath();
            ctx.strokeStyle = color;
            cluster.points.forEach(point => {
                ctx.lineTo(point.x, point.y, color);
            });

            ctx.closePath();
            ctx.stroke();
        });

        clustersKMeans.forEach((cluster) => {
            const color = randomColor();

            ctx.fillStyle = color;

            cluster.points.forEach(point => {
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
                    label="kMeans и WARD: Введите количество кластеров"
                    description="Введите размеры поля"
                    maxLength={4}
                    value={k}
                    onChange={changeAmountOfClusters}
                />
            </div>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="DBSCAN: Введите радиус поиска"
                    description="Введите размеры поля"
                    maxLength={4}
                    value={radius}
                    onChange={changeRadius}
                />
            </div>

            <div className={style.inputContainer}>
                <Input
                    type="text"
                    label="DBSCAN: Введите количество точек в радиусе"
                    description="Введите размеры поля"
                    maxLength={4}
                    value={minAmount}
                    onChange={changeMinAmount}
                />
            </div>

            <div className={style.buttonList}>
                <Button
                    type="soft"
                    onClick={() => drawClusters("kMeans")}
                >
                    Запустить
                </Button>
            </div>

            <div className={style.buttonContainer}>
                <Button
                    type="primary"
                    onClick={refreshCanvas}
                >
                    Перезагрузить
                </Button>
            </div>
        </MenuWrapper>
    );
}
