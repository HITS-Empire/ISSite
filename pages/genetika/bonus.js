import { useState, useEffect } from "react";
import Menu from "../../components/Algorithms/Genetic/Bonus/Menu";
import Code from "../../components/Algorithms/Genetic/Bonus/Code";

export default function Genetic() {
    // Код программы
    const [code, setCode] = useState(
        [
            "// Напечатать сообщение в консоль",
            "const print = (message) => {",
            "    console.log(message);",
            "};",
            "",
            "print(\"Higher IT School\");"
        ].join("\n")
    );

    // Вывод программы
    const [output, setOutput] = useState();

    // Номер элемента
    const [number, setNumber] = useState(8);

    // Выполнить код в изменённом контексте console.log
    const runCode = () => {
        const messages = [];
        const console = {};

        console.log = (message) => messages.push(message);

        try {
            eval(code);
        } catch (error) {
            messages.push(error.message);
        }

        return messages;
    };

    // Отследить изменение программы, чтобы изменить вывод
    useEffect(() => {
        setOutput(runCode().join("\n"));
    }, [code]);

    return (
        <>
            <Menu />

            <Code
                code={code}
                output={output}
            />
        </>
    );
}
