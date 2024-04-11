import Link from "next/link";
import { useRouter } from "next/router";
import style from "./style.module.scss";
import { useState, useEffect } from "react";

export default function Navigation({
    href,
    titles,
    isResizing = false
}) {
    const router = useRouter();

	// Название ссылки
	const [title, setTitle] = useState(titles[0]);

	// Изменять размер ссылки при изменении ширины экрана
	const resizeEvent = () => {
		const index = Number(window.innerWidth < 1400);

		setTitle(titles[index]);
	};

	// Добавить ивент на изменение ширины экрана
    if (isResizing) {
        useEffect(() => {
            resizeEvent();

            window.addEventListener("resize", resizeEvent);

            return () => {
                window.removeEventListener("resize", resizeEvent);
            };
        }, []);
    }

	// Если пользователь находится на странице ссылки, то выделять ссылку
	const active = String(router.asPath.split("/")[1] === href.split("/")[1]);

    return (
        <li className={style.li}>
            <Link
				className={style.link}
				href={href}
				active={active}
			>
				{title}
			</Link>
        </li>
    );
}
