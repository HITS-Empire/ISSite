import style from "./style.module.scss";
import NavigationLink from "./NavigationLink";

export default function Header() {
    return (
        <header className={style.header}>
            <div className={style.logo}>
                ISSite
            </div>

            <nav className={style.nav}>
                <ul className={style.ul}>
                    <NavigationLink href="/" title="Главная" />
                    <NavigationLink href="/labirint" title="А*" />
                    <NavigationLink href="/klasterizatsiya" title="Алгоритм кластеризации" />
                    <NavigationLink href="/genetika/baza" title="Генетический алгоритм" />
                    <NavigationLink href="/muravey" title="Муравьиный алгоритм" />
                    <NavigationLink href="/derevo" title="Дерево решений" />
                    <NavigationLink href="/neyro" title="Нейронная сеть" />
                </ul>
            </nav>
        </header>
    );
}
