import Link from "next/link";
import style from "./style.module.scss";
import NavigationLink from "./NavigationLink";

export default function Header() {
    return (
        <header className={style.header}>
            <Link className={style.logo} href="/">
                ISSite
            </Link>

            <nav className={style.nav}>
                <ul className={style.ul}>
                    <NavigationLink
                        href="/"
                        titles={["Главная", "Главная"]}
                    />
                    <NavigationLink
                        href="/labirint"
                        titles={["А*", "А*"]}
                    />
                    <NavigationLink
                        href="/klasterizatsiya"
                        titles={["Алгоритм кластеризации", "Кластеризация"]}
                    />
                    <NavigationLink
                        href="/genetika/baza"
                        titles={["Генетический алгоритм", "Генетика"]}
                    />
                    <NavigationLink
                        href="/muravey"
                        titles={["Муравьиный алгоритм", "Муравьи"]}
                    />
                    <NavigationLink
                        href="/derevo"
                        titles={["Дерево решений", "Дерево"]}
                    />
                    <NavigationLink
                        href="/neyro"
                        titles={["Нейронная сеть", "Нейросеть"]}
                    />
                </ul>
            </nav>
        </header>
    );
}
