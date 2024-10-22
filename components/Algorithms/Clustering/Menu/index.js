import Input from "../../../Input";
import { WARD } from "../Utils/WARD";
import Button from "../../../Button";
import style from "./style.module.scss";
import { kMeans } from "../Utils/kMeans";
import { DBSCAN } from "../Utils/DBSCAN";
import MenuWrapper from "../../../MenuWrapper";
import ButtonContainer from "../../../ButtonContainer";

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
    // Функция для определения цвета 
    const randomColor = (addition = 128) => {
        const red = Math.floor(Math.random() * 128) + addition; // Генерация красного цвета от 128 до 255
        const green = Math.floor(Math.random() * 128) + addition; // Генерация зеленого цвета от 128 до 255
        const blue = Math.floor(Math.random() * 128) + addition; // Генерация синего цвета от 128 до 255

        return `rgb(${red}, ${green}, ${blue})`;
    }

    // Посчитать расстояние между точками
    const distance = (first, second) => {
        return Math.sqrt(Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2));
    }

    // Проход по внешнему контуру фигуры
    const passAlongOuterContour = (points, action) => {
        const PI2 = Math.PI * 2;

        let startPoint = points[0];
        let currentPoint = startPoint;
        let currentLook = 0;
        let isEnd = false;

        action(startPoint);

        while (true) {
            let nextPoint;
            let nextLook;

            let minDeltaLook = PI2;
        
            points.forEach((point) => {
                if (point === currentPoint) return;

                const look = Math.atan((point.y - currentPoint.y) / (currentPoint.x - point.x));
                const deltaLook = (PI2 + look - currentLook) % PI2;

                if (deltaLook !== 0 && deltaLook < minDeltaLook) {
                    nextPoint = point;
                    nextLook = look;

                    minDeltaLook = deltaLook;
                }
            });

            if (!nextPoint) break;

            currentPoint = nextPoint;
            currentLook = nextLook;

            action(currentPoint);

            if (startPoint === currentPoint) {
                isEnd = true;
            } else if (isEnd) {
                break;
            }
        };
    };

    // Раскрашивание кластеров
    const drawClusters = () => {
        const clustersKMeans = kMeans(points, clusters);
        const clustersDBSCAN = DBSCAN(points, radius, minAmount);
        const clustersWARD = WARD(points, clusters);

        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.lineCap = "round";

        clustersWARD
            .sort((firstCluster, secondCluster) => {
                return secondCluster.points.length - firstCluster.points.length;
            })
            .forEach((cluster) => {
                const color = randomColor(32);
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                ctx.lineWidth = 30;

                // Сортировка по Y (первый элемент - самая максимальная координата по Y)
                const points = Array
                    .from(new Set(cluster.points))
                    .sort((firstPoint, secondPoint) => {
                        return secondPoint.y - firstPoint.y;
                    });

                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);

                // Залить внутренность
                passAlongOuterContour(points, (point) => {
                    ctx.lineTo(point.x, point.y);
                });

                ctx.fill();
                ctx.closePath();

                let previosPoint = points[points.length - 1];

                // Добавить плавные края
                passAlongOuterContour(points, (point) => {
                    ctx.beginPath();
                    ctx.moveTo(previosPoint.x, previosPoint.y);
                    ctx.lineTo(point.x, point.y);
                    ctx.stroke();
                    ctx.closePath();

                    previosPoint = point;
                });
            });

        clustersDBSCAN.forEach((cluster) => {
            const color = randomColor();
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;

            for (let i = 0; i < cluster.points.length - 1; i++) {
                let minDistance = 100000000;
                let indexMinDistance = -1;
                
                for (let j = i + 1; j < cluster.points.length; j++) {
                    if (distance(cluster.points[i], cluster.points[j]) < minDistance) {
                        minDistance = distance(cluster.points[i], cluster.points[j]);
                        indexMinDistance = j;
                    }
                }
                
                if (indexMinDistance !== -1) {
                    const temp = cluster.points[i + 1];
                    cluster.points[i + 1] = cluster.points[indexMinDistance];
                    cluster.points[indexMinDistance] = temp; 
                }
            }

            let previosPoint = cluster.points[cluster.points.length - 1];

            cluster.points.forEach((point) => {
                ctx.beginPath();
                ctx.moveTo(previosPoint.x, previosPoint.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();

                previosPoint = point;
            });
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
            className={style.menu}
            title="Алгоритм кластеризации"
            description="Сейчас вы узрите, как работает алгоритм кластеризации."
        >
            <Input
                label="kMeans и WARD: Количество кластеров"
                description="Введите количество кластеров"
                isNumber={true}
                max={32}
                value={clusters}
                setValue={setClusters}
            />

            <Input
                label="DBSCAN: Радиус поиска"
                description="Введите радиус поиска"
                isNumber={true}
                max={2048}
                value={radius}
                setValue={setRadius}
            />

            <Input
                label="DBSCAN: Количество точек в радиусе"
                description="Введите количество точек в радиусе"
                isNumber={true}
                max={1024}
                value={minAmount}
                setValue={setMinAmount}
            />

            <ButtonContainer>
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
            </ButtonContainer>

            <p className={style.additionally}>
                Области - WARD, линии - DBSCAN, точки - kMeans
            </p>
        </MenuWrapper>
    );
}
