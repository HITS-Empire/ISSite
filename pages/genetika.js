import { useState, useEffect } from "react";
import {
    runCode,
    getProgram,
    runGenetic,
    getCodeFromProgram,
    getPopulation
} from "../components/Algorithms/Genetic/Utils/genetic";
import Menu from "../components/Algorithms/Genetic/Menu";
import Code from "../components/Algorithms/Genetic/Code";

export default function Genetic() {
    // Код, который показывается пользователю
    const [code, setCode] = useState("");

    // Вывод программы
    const [output, setOutput] = useState([]);

    // Статус программы (0 - не активно, 1 - выполняется поиск, 2 - поиск завершён)
    const [status, setStatus] = useState(0);

    // Номер элемента последовательности
    const [number, setNumber] = useState(8);

    // Запустить или остановить программу
    useEffect(() => {
        if (status === 0) {
            const correctProgram = getProgram(2);
            const correctOutput = runCode(getCodeFromProgram(correctProgram, true), number);

            setCode(getCodeFromProgram(correctProgram));
            setOutput([correctOutput[correctOutput.length - 1]]);
        }

        if (status === 1) {
            const population = getPopulation();
            const correctOutput = runCode(code, -1);

            const interval = setInterval(runGenetic, 50, {
                setCode,
                setOutput,
                setStatus,
                number,
                population,
                correctOutput
            });

            return () => {
                clearInterval(interval);
            };
        }
    }, [number, status]);

    return (
        <>
            <Menu
                number={number}
                setNumber={setNumber}
                status={status}
                setStatus={setStatus}
            />

            <Code
                code={code}
                output={output}
            />
        </>
    );
}
