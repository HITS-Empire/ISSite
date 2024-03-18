import Link from "next/link";
import { useRouter } from "next/router";
import style from "../style.module.scss";

export default function NavigationLink({ href, title }) {
    const router = useRouter();

	// Если пользователь находится на странице ссылки, то выделять ссылку
	const active = router.asPath === href ? "true" : "false";

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
