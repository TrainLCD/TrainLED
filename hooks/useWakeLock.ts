"use client";
import { useCallback, useEffect, useRef } from "react";

const useWakeLock = (): (() => Promise<void>) => {
  const wakeLock = useRef(null);

  const requestWakeLock = useCallback(async () => {
    const untypedNavigator = navigator as any;
    try {
      wakeLock.current = await untypedNavigator.wakeLock.request();
      console.log("Wake Lock is active");
    } catch (err: any) {
      console.error(`${err.name}, ${err.message}`);
    }
  }, []);

  const handleVisibilityChange = useCallback(async () => {
    if (wakeLock.current !== null && document.visibilityState === "visible") {
      await requestWakeLock();
    }
  }, [requestWakeLock]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  return requestWakeLock;
};

export default useWakeLock;
