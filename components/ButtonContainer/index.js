import style from "./style.module.scss";

export default function ButtonContainer({ children }) {
    return (
        <div className={style.buttonContainer}>
            {children}
        </div>
    );
}
