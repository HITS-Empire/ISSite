import fs from "fs";
import { useState, useEffect } from "react";
import {
    runCode,
    runGenetic
} from "../../components/Algorithms/Genetic/Bonus/Utils/genetic";
import Menu from "../../components/Algorithms/Genetic/Bonus/Menu";
import Code from "../../components/Algorithms/Genetic/Bonus/Code";

export const getStaticProps = () => {
    const source = fs.readFileSync("./public/fibonacci.js", "utf8");

    return {
        props: { source }
    };
};

export default function Genetic({ source }) {
    // Код программы
    const [code, setCode] = useState(source);

    // Вывод программы
    const [output, setOutput] = useState([]);

    // Номер элемента
    const [number, setNumber] = useState(8);

    // Популяция
    const [population, setPopulation] = useState([]);

    // Искомое число последовательности
    const [correctValue, setCorrectValue] = useState();

    // Работает ли сейчас программа
    const [processIsActive, setProcessIsActive] = useState(false);

    // При изменении вывода запустить снова
    useEffect(() => {
        if (!processIsActive) {
            if (code === source) {
                setCorrectValue(Number(output[0]));
            }

            return setCode(source);
        }

        runGenetic({
            code,
            setCode,
            output,
            setOutput,
            number,
            population,
            setPopulation,
            correctValue
        });
    }, [output, processIsActive]);

    // Отследить изменение программы, чтобы изменить вывод
    useEffect(() => {
        setOutput(runCode(code, number));
    }, [code, number]);

    return (
        <>
            <Menu
                number={number}
                setNumber={setNumber}
                population={population}
                setPopulation={setPopulation}
                processIsActive={processIsActive}
                setProcessIsActive={setProcessIsActive}
            />

            <Code
                code={code}
                output={output}
            />
        </>
    );
}
