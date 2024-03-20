import style from "./style.module.scss";
import { useRef, useState, useEffect } from "react";
import { createCanvas } from "../../../../utils/canvas";

export default function Field({
    count,
    field,
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

    // Активная ячейка
    const [currentCell, setCurrentCell] = useState();

    // Событие перемещения по полю
    const moveMouseEvent = (event) => {
        const { width: size } = canvas.getBoundingClientRect();
        const { offsetX, offsetY } = event.nativeEvent;

        const row = Math.floor(offsetX / size * count);
        const column = Math.floor(offsetY / size * count);

        if (!field?.[row]?.[column]) return;

        setCurrentCell(field[row][column]);
    };

    // Событие клика на бокс
    const clickEvent = () => {
        if (startEditorIsActive) {
            if (startCell !== currentCell) {
                startCell.type = 0;
                currentCell.type = 2;

                startCell.draw();
                currentCell.draw();

                setStartCell(currentCell);
            }

            return setStartEditorIsActive(false);
        }
        if (endEditorIsActive) {
            if (endCell !== currentCell) {
                endCell.type = 0;
                currentCell.type = 3;

                endCell.draw();
                currentCell.draw();

                setEndCell(currentCell);
            }

            return setEndEditorIsActive(false);
        }

        if (currentCell.type === 2) {
            return setStartEditorIsActive(true);
        }
        if (currentCell.type === 3) {
            return setEndEditorIsActive(true);
        }

        currentCell.type = Number(!currentCell.type);
        currentCell.draw();
    };

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

    // Добавить начальную ячейку, когда поле загружено
    useEffect(() => {
        if (currentCell) return;

        setCurrentCell(startCell);
    }, [startCell]);

    // Canvas загружен, нужно рассчитать функции и координаты
    useEffect(() => {
        if (!ctx || !images) return;

        const border = 1000 / count;
        const ceilBorder = Math.ceil(border);

        field.forEach((line, row) => line.forEach((cell, column) => {
            cell.x = Math.ceil(border * row);
            cell.y = Math.ceil(border * column);

            cell.draw = () => {
                ctx.clearRect(cell.x, cell.y, ceilBorder, ceilBorder);
                ctx.drawImage(images[cell.type], cell.x, cell.y, ceilBorder, ceilBorder);
            };

            cell.draw();
        }));
    }, [images, field]);

    const extra = (
        startEditorIsActive && (currentCell.type === 0 || currentCell.type === 2) && style.start
    ) || (
        endEditorIsActive && (currentCell.type === 0 || currentCell.type === 3) && style.end
    ) || "";

    const disabled = processIsActive || (
        startEditorIsActive && (currentCell.type === 1 || currentCell.type === 3)
    ) || (
        endEditorIsActive && (currentCell.type === 1 || currentCell.type === 2)
    );

    return (
        <div className={style.field}>
            <canvas ref={canvasRef} onMouseMove={moveMouseEvent} />
            <button
                className={`${style.box} ${extra}`}
                disabled={disabled}
                onClick={clickEvent}
                style={{
                    width: `calc(100% / ${count})`,
                    height: `calc(100% / ${count})`,
                    margin: currentCell ? (
                        `calc(100% * ${currentCell.column / count}) 0 0 calc(100% * ${currentCell.row / count})`
                    ) : 0
                }}
            />
        </div>
    );
}
