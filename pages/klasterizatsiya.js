import { useRef, useState, useEffect } from "react";
import Menu from "../components/Algorithms/Clustering/Menu";
import Field from "../components/Algorithms/Clustering/Field";

export default function Clustering() {
    // Активен ли процесс кластеризации
    const [processIsActive, setProcessIsActive] = useState(false);

    return (
        <>
            <Menu
                processIsActive={processIsActive}
                setProcessIsActive={setProcessIsActive}
            />

            <Field
                processIsActive={processIsActive}
            />
        </>
    );
}
