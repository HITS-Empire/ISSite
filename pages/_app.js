import MainLayout from "../components/MainLayout";

import "../styles/_globals.scss";

export default function App({ Component, pageProps }) {
    return (
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
    );
}
