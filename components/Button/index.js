import style from "./style.module.scss";

export default function Button({ type, disabled, onClick, children }) {
    return (
        <button
            className={`${style.button} ${style[type]}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
