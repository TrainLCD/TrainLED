import { useCallback, useEffect } from "react";

const isClient = typeof window !== "undefined";

const useWakeLock = (): (() => Promise<void>) => {
  const requestWakeLock = useCallback(async () => {
    const untypedNavigator = navigator as any;
    if (isClient && "wakeLock" in navigator) {
      try {
        await untypedNavigator.wakeLock.request("screen");
        console.log("Wake Lock is active");
      } catch (err: any) {
        const msg = `${err.name}, ${err.message}`;
        console.error(msg);
      }
    }
  }, []);

  const handleVisibilityChange = useCallback(async () => {
    if (document.visibilityState === "visible") {
      await requestWakeLock();
    }
  }, [requestWakeLock]);

  useEffect(() => {
    if (isClient) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () =>
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
    }
    return () => undefined;
  }, [handleVisibilityChange]);

  return requestWakeLock;
};

export default useWakeLock;
