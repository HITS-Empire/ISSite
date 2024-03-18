import Header from "../Header";
import style from "./style.module.scss";

export default function MainLayout({ children }) {
    return (
        <>
            <Header />

            <main className={style.main}>{children}</main>
        </>
    );
}
