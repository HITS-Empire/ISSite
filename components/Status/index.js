import style from "./style.module.scss";

export default function Status({ type, children }) {
    let classNames = [style.status];

    switch (type) {
        case 1:
            classNames.push(style.success);
            break;
        case 2:
            classNames.push(style.error);
    }

    classNames = classNames.join(" ");

    return (
        <div className={classNames}>
            {children}
        </div>
    );
}
