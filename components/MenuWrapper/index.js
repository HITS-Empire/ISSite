import style from "./style.module.scss";

export default function MenuWrapper({
    className,
    title,
    description,
    children
}) {
    let classNames = [style.menu];

    if (className) {
        classNames.push(className);
    }

    classNames = classNames.join(" ");

    return (
        <div className={classNames}>
            <p className={style.title}>
                {title}
            </p>
            <span>{description}</span>

            {children}
        </div>
    );
}
