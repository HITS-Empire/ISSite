import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Clustering/Menu";
import Field from "../components/Algorithms/Clustering/Field";

export default function Clustering() {
    // Статус поиска ("success" или "error")
    const [status, setStatus] = useState();
    
    // Активен ли процесс кластеризации
    const [processIsActive, setProcessIsActive] = useState(false);

    return (
        <>
            <Menu
                processIsActive={processIsActive}
                setProcessIsActive={setProcessIsActive}
                status={status}
            />

            <Field
                processIsActive={processIsActive}
            />
        </>
    );
}
