import { useCallback, useEffect, useRef } from "react";

const isClient = typeof window !== "undefined";

const useWakeLock = (): (() => Promise<void>) => {
  const wakeLockRef = useRef<any | null>(null);

  const requestWakeLock = useCallback(async () => {
    const untypedNavigator = navigator as any;
    if (isClient && "wakeLock" in navigator) {
      try {
        const wakeLock = await untypedNavigator.wakeLock.request("screen");
        console.log("Wake Lock is active");
        wakeLockRef.current = wakeLock;
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

  useEffect(() => {
    wakeLockRef.current?.addEventListener("release", () => {
      console.log("Wake Lock was released");
    });
  }, []);

  return requestWakeLock;
};

export default useWakeLock;
