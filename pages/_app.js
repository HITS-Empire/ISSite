import MainLayout from "../components/MainLayout";

export default function App({ Component, pageProps }) {
    return (
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
    );
}
