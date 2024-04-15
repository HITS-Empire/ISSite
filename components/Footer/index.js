import Navigation from "../Navigation";
import style from "./style.module.scss";

export default function Footer() {
    return (
        <footer className={style.footer}>
            <nav className={style.nav}>
                <ul className={style.ul}>
                    <Navigation
                        href="/"
                        titles={["Главная"]}
                    />
                    <Navigation
                        href="/labirint"
                        titles={["А*"]}
                    />
                    <Navigation
                        href="/klasterizatsiya"
                        titles={["Алгоритм кластеризации"]}
                    />
                    <Navigation
                        href="/genetika"
                        titles={["Генетический алгоритм"]}
                    />
                    <Navigation
                        href="/muravey"
                        titles={["Муравьиный алгоритм"]}
                    />
                    <Navigation
                        href="/derevo"
                        titles={["Дерево решений"]}
                    />
                    <Navigation
                        href="/neyro"
                        titles={["Нейронная сеть"]}
                    />
                </ul>
            </nav>
        </footer>
    );
}
