import { useEffect } from "react";
import style from "./style.module.scss";
import "highlight.js/styles/github-dark.css";

const hljs = require("highlight.js");

export default function Code({
    code,
    output
}) {
    // При изменении кода изменить его на экране
    useEffect(() => {
        const element = document.getElementById("code");

        const { value } = hljs.highlight(code, { language: "js" });

        element.innerHTML = value;
    }, [code]);

    return (
        <div className={style.codeContainer}>
            <pre className={style.highlight}>
                <code id="code" className="language-js" />
            </pre>

            <div className={style.console}>
                <code className={style.arrow}>
                    {">"}
                </code>

                <code className={style.output}>
                    {output.join("\n")}
                </code>
            </div>
        </div>
    );
}
