import Nothing from "../components/Nothing";

// Переадресация на А*
export const getServerSideProps = () => {
    return {
        redirect: {
            destination: "/labirint",
            permanent: true
        }
    };
};

export default function Index() {
    return (
        <Nothing text="Здесь пока ничего нет..."/>
    );
}
