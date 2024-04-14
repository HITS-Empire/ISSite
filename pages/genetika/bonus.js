import { useState, useEffect } from "react";
import {
    runCode,
    getProgram,
    runGenetic,
    getCodeFromProgram
} from "../../components/Algorithms/Genetic/Bonus/Utils/genetic";
import Menu from "../../components/Algorithms/Genetic/Bonus/Menu";
import Code from "../../components/Algorithms/Genetic/Bonus/Code";

export default function Genetic() {
    // Код, который показывается пользователю
    const [code, setCode] = useState("");

    // Правильная послежовательность
    const [correctSequence, setCorrectSequence] = useState([]);

    // Вывод программы
    const [output, setOutput] = useState([]);

    // Номер элемента последовательности
    const [number, setNumber] = useState(8);

    // Популяция
    const [population, setPopulation] = useState([]);

    // Статус программы (0 - не активно, 1 - выполняется поиск, 2 - поиск завершён)
    const [status, setStatus] = useState(0);

    // Запустить или остановить программу
    useEffect(() => {
        if (status === 0) {
            const correctProgram = getProgram(2);
            const correctOutput = runCode(getCodeFromProgram(correctProgram, true), number);

            setCode(getCodeFromProgram(correctProgram));
            setOutput(correctOutput);
            setCorrectSequence(correctOutput);
        }

        if (status === 1) {
            const interval = setInterval(runGenetic, 50, {
                setCode,
                setOutput,
                number,
                population,
                setPopulation,
                setStatus,
                correctSequence
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
                setPopulation={setPopulation}
                status={status}
                setStatus={setStatus}
                correctSequence={correctSequence} 
                setCorrectSequence={setCorrectSequence}
            />

            <Code
                code={code}
                output={output}
            />
        </>
    );
}
