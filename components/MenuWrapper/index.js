import style from "./style.module.scss";

export default function MenuWrapper({
    title,
    description,
    children
}) {
    return (
        <div className={style.menu}>
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
