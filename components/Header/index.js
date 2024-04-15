import Link from "next/link";
import Image from "next/image";
import Navigation from "../Navigation";
import style from "./style.module.scss";

export default function Header() {
    return (
        <header className={style.header}>
            <Link className={style.logo} href="/">
                <Image src="/gte.png" width={384} height={384} />
                ISSite
            </Link>

            <nav className={style.nav}>
                <ul className={style.ul}>
                    <Navigation
                        href="/"
                        titles={["Главная", "Главная"]}
                        isResizing={true}
                    />
                    <Navigation
                        href="/labirint"
                        titles={["А*", "А*"]}
                        isResizing={true}
                    />
                    <Navigation
                        href="/klasterizatsiya"
                        titles={["Алгоритм кластеризации", "Кластеризация"]}
                        isResizing={true}
                    />
                    <Navigation
                        href="/genetika"
                        titles={["Генетический алгоритм", "Генетика"]}
                        isResizing={true}
                    />
                    <Navigation
                        href="/muravey"
                        titles={["Муравьиный алгоритм", "Муравьи"]}
                        isResizing={true}
                    />
                    <Navigation
                        href="/derevo"
                        titles={["Дерево решений", "Дерево"]}
                        isResizing={true}
                    />
                    <Navigation
                        href="/neyro"
                        titles={["Нейронная сеть", "Нейросеть"]}
                        isResizing={true}
                    />
                </ul>
            </nav>
        </header>
    );
}
