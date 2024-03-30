import style from "./style.module.scss";

export default function MenuWrapper({
    title,
    description,
    css,
    children
}) {
    return (
        <div className={style.menu} style={css}>
            <p className={style.title}>
                {title}
            </p>
            <span className={style.description}>
                {description}
            </span>

            {children}
        </div>
    );
}
