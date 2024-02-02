import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  onRouteChangeStart: () => void;
};

export const useBrowserBack = ({ onRouteChangeStart }: Props) => {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", onRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
    };
  }, [onRouteChangeStart, router.events]);
};
