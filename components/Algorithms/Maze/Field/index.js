import style from "./style.module.scss";
import { useRef, useState, useEffect } from "react";
import { createCanvas } from "../../../../utils/canvas";

export default function Field({
    count,
    field,
    setField,
    startCell,
    setStartCell,
    endCell,
    setEndCell,
    startEditorIsActive,
    setStartEditorIsActive,
    endEditorIsActive,
    setEndEditorIsActive,
    processIsActive
}) {
    const canvasRef = useRef();

    // Состояния для работы с Canvas
    const [canvas, setCanvas] = useState();
    const [ctx, setCtx] = useState();

    // Картинки для поля
    const [images, setImages] = useState();

    // Создать Canvas и загрузить картинки
    useEffect(() => {
        createCanvas({
            canvasRef,
            setCanvas,
            setCtx,
            size: 1000
        });

        let imagesUploaded = 0;
        const images = [];

        for (let i = 0; i < 6; i++) {
            const image = new Image();

            switch (i) {
                case 0:
                    image.src = "/grass.png";
                    break;
                case 1:
                    image.src = "/bedrock.png";
                    break;
                case 2:
                    image.src = "/steve.png";
                    break;
                case 3:
                    image.src = "/diamond.png";
                    break;
                case 4:
                    image.src = "/water.png";
                    break;
                case 5:
                    image.src = "/gold.png";
            }

            images.push(image);

            image.onload = () => {
                imagesUploaded++;
    
                if (imagesUploaded === 6) {
                    setImages(images);
                }
            };
        }
    }, []);

    // Canvas загружен, нужно рассчитать функции и координаты
    useEffect(() => {
        if (!ctx || !images) return;

        const border = 1000 / count;

        field.forEach((line, row) => line.forEach((cell, column) => {
            cell.x = border * row;
            cell.y = border * column;

            cell.changeType = (type) => {
                ctx.clearRect(cell.x, cell.y, border, border);
                ctx.drawImage(images[type], cell.x, cell.y, border, border);
            };

            cell.changeType(cell.type);
        }));
    }, [images, field]);

    return (
        <div className={style.field}>
            <canvas id="minecraft" ref={canvasRef} />
        </div>
    );
}
