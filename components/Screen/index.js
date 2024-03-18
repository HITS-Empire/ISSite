import style from "./style.module.scss";

export default function Screen({ children }) {
    return (
        <div className={style.screen}>
            {children}
        </div>
    );
}
