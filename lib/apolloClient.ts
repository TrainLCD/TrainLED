import { ApolloClient, InMemoryCache } from "@apollo/client";

export default new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SAPI_URL,
  cache: new InMemoryCache(),
});
