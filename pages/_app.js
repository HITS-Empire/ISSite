import Head from "next/head";
import MainLayout from "../components/MainLayout";

import "../styles/_globals.scss";

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="gte.png" type="image/png" />
            </Head>

            <MainLayout>
                <Component {...pageProps} />
            </MainLayout>
        </>
    );
}
