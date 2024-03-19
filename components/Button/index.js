import style from "./style.module.scss";

export default function Button({ type, disabled, children }) {
    return (
        <button
            className={`${style.button} ${style[type]}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
