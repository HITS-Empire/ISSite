import {
    runCode,
    getCodeFromProgram,
    getCorrectFibonacciOutput,
    getCorrectFibonacciProgram
} from "../utils/genetic";
import { useState, useEffect } from "react";
import Menu from "../components/Algorithms/Genetic/Bonus/Menu";
import Code from "../components/Algorithms/Genetic/Bonus/Code";

// Скомпилировано ли API
let apiIsCompiled = false;

export default function BonusGenetic() {
    // Код, который показывается пользователю
    const [code, setCode] = useState("");

    // Вывод программы
    const [output, setOutput] = useState([]);

    // Статус программы (0 - не активно, 1 - выполняется поиск, 2 - поиск завершён)
    const [status, setStatus] = useState(0);

    // Номер элемента последовательности
    const [number, setNumber] = useState(8);

    // Текущая крутость программы и максимальная крутость
    const [fitness, setFitness] = useState(0);
    const [maxFitness, setMaxFitness] = useState(0);

    // ID алгоритма для работы с API
    const [id, setId] = useState();

    // Ответ на запрос
    const [data, setData] = useState();

    // Рассчитать максимальную крутость программы
    useEffect(() => {
        const correctOutput = getCorrectFibonacciOutput();
        let sum = 0;

        correctOutput.forEach((output) => {
            sum += Number(output);
        });

        setMaxFitness(sum);

        // Скомпилировать API холостым вызовом
        if (!apiIsCompiled) {
            fetch("/api/kod/run");

            apiIsCompiled = true;
        }
    }, []);

    // Запустить или остановить программу
    useEffect(() => {
        if (status === 0) {
            const program = getCorrectFibonacciProgram();
            const newCode = getCodeFromProgram(program);

            setCode(newCode);
            setOutput(runCode(newCode, number));
            setId();
        }

        if (status === 1) {
            setId(String(Math.random()));
            setFitness(maxFitness);
        }

        if (status === 2) {
            setOutput(runCode(code, number));
            setId();
        }
    }, [number, status]);

    // Обработка ответов на запросы
    useEffect(() => {
        if (!id) return setData();

        if (data) {
            const {
                id: currentId,
                code: newCode,
                fitness: newFitness
            } = data;

            if (id !== currentId) return;

            setCode(newCode);
            setOutput(runCode(newCode, number));
            setFitness(newFitness);

            if (newFitness === 0) {
                return setStatus(2);
            }
        }

        // Создать новый запрос с задержкой
        setTimeout(async () => {
            const response = await fetch("/api/kod/run", {
                method: "POST",
                body: id
            });
            const newData = await response.json();

            setData(newData);
        }, 50);
    }, [id, data]);

    return (
        <>
            <Menu
                number={number}
                setNumber={setNumber}
                status={status}
                setStatus={setStatus}
                fitness={fitness}
                maxFitness={maxFitness}
            />

            <Code
                code={code}
                output={output}
            />
        </>
    );
}
