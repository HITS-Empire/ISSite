import style from "./style.module.scss";

export default function Cell({
    count,
    isBarrier,
    isStart,
    isEnd
}) {
    return (
        <div
            className={style[isStart ? "start" : isEnd ? "end" : isBarrier ? "barrier" : "active"]}
            style={{
                width: `calc(95% / ${count})`,
                height: `calc(95% / ${count})`,
                margin: `calc(2.5% / ${count})`,
                "border-radius": "5%"
            }}
        />
    );
}
