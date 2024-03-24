import style from "./style.module.scss";
import { useEffect, useState } from "react";
import { createCanvas } from "../../utils/canvas";

export default function FieldWrapper({
    count,
    field,
    canvasRef,
    canvas,
    setCanvas,
    ctx,
    setCtx,
    images: imagesSrc,
    fieldClassName,
    boxClassName,
    clickEvent,
    currentCell,
    setCurrentCell,
    boxDisabled,
    children
}) {
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
        const prefix = "/";
        const images = [];

        for (let i = 0; i < imagesSrc.length; i++) {
            const image = new Image();

            image.src = prefix + imagesSrc[i];
            images.push(image);

            image.onload = () => {
                imagesUploaded++;
    
                if (imagesUploaded === imagesSrc.length) {
                    setImages(images);
                }
            };
        }
    }, []);

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

    let fieldClassNames = [style.field];
    if (fieldClassName) {
        fieldClassNames.push(fieldClassName);
    }
    fieldClassNames = fieldClassNames.join(" ");

    let boxClassNames = [style.box];
    if (boxClassName) {
        boxClassNames.push(boxClassName);
    }
    boxClassNames = boxClassNames.join(" ");

    // Событие перемещения по полю
    const moveMouseEvent = (event) => {
        const { width: size } = canvas.getBoundingClientRect();
        const { offsetX, offsetY } = event.nativeEvent;

        const row = Math.floor(offsetX / size * count);
        const column = Math.floor(offsetY / size * count);

        if (!field?.[row]?.[column]) return;

        setCurrentCell(field[row][column]);
    };

    // Стили для боксов
    const boxStyles = {
        width: `calc(100% / ${count})`,
        height: `calc(100% / ${count})`,
        margin: currentCell ? (
            `calc(100% * ${currentCell.column / count}) 0 0 calc(100% * ${currentCell.row / count})`
        ) : 0
    };

    // Добавить начальную ячейку, когда поле загружено
    useEffect(() => {
        if (!field?.[0]?.[0]) return;

        setCurrentCell(field[0][0]);
    }, [field]);

    return (
        <div className={fieldClassNames}>
            <div className={style.handler} onMouseMove={moveMouseEvent} />
            <canvas ref={canvasRef} />

            <div
                className={`${boxClassNames} ${style.firstLayer}`}
                style={boxStyles}
            />
            <button
                className={`${style.box} ${style.secondLayer}`}
                disabled={boxDisabled}
                onClick={clickEvent}
                style={boxStyles}
            />
            {children}
        </div>
    );
}
