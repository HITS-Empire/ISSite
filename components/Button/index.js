import style from "./style.module.scss";

export default function Button({
    type,
    disabled,
    onClick,
    onChange,
    input,
    children
}) {
    return input ? (
        <>
            <label
                className={`${style.button} ${style[type]}`}
                active={String(!disabled)}
                htmlFor={input.id}
            >
                {children}
            </label>
            <input
                className={style.input}
                disabled={disabled}
                id={input.id}
                type={input.type}
                accept={input.accept}
                onChange={onChange}
            />
        </>
    ) : (
        <button
            className={`${style.button} ${style[type]}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
