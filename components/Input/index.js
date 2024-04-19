import style from "./style.module.scss";

export default function Input({
    type = "text",
    label,
    placeholder,
    isNumber = false,
    min = 0,
    max = 0,
    value,
    setValue,
    disabled
}) {
    const onChange = (event) => {
        const value = event.target.value;

        if (!isNumber) return setValue(value);

        if (!/^\d*$/.test(value)) return;

        setValue(Math.min(Math.max(event.target.value, min), max));
    };

    return (
        <div className={style.input}>
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                autoFocus={true}
                onChange={onChange}
            />
        </div>
    );
}
