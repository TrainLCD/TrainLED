import { useCallback, useEffect, useRef } from "react";

const isNavigatorAvailable = typeof navigator !== "undefined";

const useWakeLock = (): (() => Promise<void>) => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    const untypedNavigator = navigator as any;
    if (isNavigatorAvailable && "wakeLock" in navigator) {
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

  useEffect(() => {
    if (isNavigatorAvailable) {
      document.addEventListener("visibilitychange", requestWakeLock);
    }
    document.removeEventListener("visibilitychange", requestWakeLock);
  }, [requestWakeLock]);

  useEffect(() => {
    wakeLockRef.current?.addEventListener("release", () => {
      console.log("Wake Lock was released");
    });
  }, []);

  return requestWakeLock;
};

export default useWakeLock;
