"use client";
import { TransportProvider } from "@connectrpc/connect-query";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider } from "jotai";

const finalTransport = createGrpcWebTransport({
  baseUrl:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_DEV_SAPI_URL ?? ""
      : process.env.NEXT_PUBLIC_SAPI_URL ?? "",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TransportProvider transport={finalTransport}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <JotaiProvider>{children}</JotaiProvider>
      </QueryClientProvider>
    </TransportProvider>
  );
}
