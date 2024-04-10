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
        const stdout = [];
    
        const console = {
            log(message) {
                stdout.push(message);
            }
        };

        try {
            eval(code);
        } catch (error) {
            stdout.push(error.message);
        }

        return stdout;
    };

    // Отследить изменение программы, чтобы изменить вывод
    useEffect(() => {
        setOutput(runCode().join(" "));
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
