import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import Head from "next/head";
import { createGlobalStyle } from "styled-components";
import apolloClient from "../lib/apolloClient";

const GlobalStyle = createGlobalStyle`
@font-face {
	font-family: 'JF-Dot-jiskan24';
	src: url(/JF-Dot-jiskan24.woff2) format('woff2');
}

html,
body {
  padding: 0;
  margin: 0;
  font-family: 'JF-Dot-jiskan24';
  background-color: #212121;
  color: white;
  overscroll-behavior-y: none;
}

html, body, #__next {
  height: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}
`;

const APP_NAME = "TrainLED";
const APP_DESCRIPTION = "A joking navigation app.";
const APP_BASE_URL = "https://led.trainlcd.app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <link
          rel="preload"
          href="/JF-Dot-jiskan24.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#212121" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#212121" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#212121"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={APP_BASE_URL} />
        <meta name="twitter:title" content={APP_NAME} />
        <meta name="twitter:description" content={APP_DESCRIPTION} />
        <meta
          name="twitter:image"
          content={`${APP_BASE_URL}/icons/icon-192.png`}
        />
        <meta name="twitter:creator" content="@tinykitten8" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={APP_NAME} />
        <meta property="og:description" content={APP_DESCRIPTION} />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:url" content={APP_BASE_URL} />
        <meta property="og:image" content={`${APP_BASE_URL}/icons/ogp.png`} />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
