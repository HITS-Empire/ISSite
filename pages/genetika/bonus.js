import fs from "fs";
import { useState, useEffect } from "react";
import Menu from "../../components/Algorithms/Genetic/Bonus/Menu";
import Code from "../../components/Algorithms/Genetic/Bonus/Code";
import {
    runCode,
    fibonacci
} from "../../components/Algorithms/Genetic/Bonus/Utils/fibonacci";

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

    // При изменении вывода запустить снова
    useEffect(() => {
        if (!population.length) {
            return setCode(source);
        }

        fibonacci({ setCode, output, setPopulation, population });
    }, [output, population]);

    // Отследить изменение программы, чтобы изменить вывод
    useEffect(() => {
        setOutput(runCode(code, number));
    }, [number, code]);

    return (
        <>
            <Menu
                number={number}
                setNumber={setNumber}
                population={population}
                setPopulation={setPopulation}
                correctOutput={output}
            />

            <Code
                code={code}
                output={output}
            />
        </>
    );
}
