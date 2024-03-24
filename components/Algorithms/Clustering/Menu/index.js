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
    ctx
}) {
    // Раскрашивание кластеров
    const drawClusters = (condition) => {
        // const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33E6", "#FF0000", "#008000"];
        const letters = "0123456789ABCDEF";

        let clusters;
        
        if (condition === "kMeans") {
            clusters = kMeans(points);
        }
        if (condition === "DBSCAN") {
            clusters = DBSCAN(points);
        }
        if (condition === "WARD") {
            clusters = WARD(points);
        }

        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        clusters.forEach((cluster, index) => {
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }

            // ctx.fillStyle = colors[index];
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(cluster.center.x, cluster.center.y, 10, 0, Math.PI * 2);
            ctx.fill();

            cluster.points.forEach(point => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
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
            <div className={style.buttonList}>
                <Button
                    type="soft"
                    onClick={() => drawClusters("kMeans")}
                >
                    К-средних
                </Button>
                <Button
                    type="soft"
                    onClick={() => drawClusters("DBSCAN")}
                >
                    DBSCAN
                </Button>
                <Button
                    type="soft"
                    onClick={() => drawClusters("WARD")}
                >
                    WARD
                </Button>
            </div>

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
