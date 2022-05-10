import { ApolloProvider } from "@apollo/client";
import { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";
import apolloClient from "../lib/apolloClient";

const GlobalStyle = createGlobalStyle`
@font-face {
	font-family: 'JF-Dot-jiskan24';
	src: url(/JF-Dot-jiskan24.ttf);
}

html,
body {
  padding: 0;
  margin: 0;
  font-family: 'JF-Dot-jiskan24';
  background-color: #212121;
  color: white;
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

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
