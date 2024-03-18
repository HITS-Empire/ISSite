import style from "./style.module.scss";

export default function Nothing({ text }) {
    return (
        <div className={style.nothing}>
            {text}
        </div>
    );
}
