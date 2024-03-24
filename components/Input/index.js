import style from "./style.module.scss";

export default function Input({
    type,
    label,
    placeholder,
    maxLength,
    value,
    disabled,
    onChange
}) {
    return (
        <div className={style.input}>
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                maxLength={maxLength}
                value={value}
                disabled={disabled}
                autoFocus={true}
                onChange={onChange}
            />
        </div>
    );
}
