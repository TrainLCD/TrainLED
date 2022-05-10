import { useCallback, useEffect, useState } from "react";
import geolocationOptions from "../constants/geolocationOptions";

const useGeolocation = (
  onPositionUpdate?: (position: GeolocationPosition) => void,
  onPositionError?: (error: GeolocationPositionError) => void | null
) => {
  const [granted, setGranted] = useState(false);

  const noop = useCallback(() => undefined, []);

  useEffect(() => {
    const promptAsync = async () => {
      const result = await navigator.permissions.query({ name: "geolocation" });
      switch (result.state) {
        case "granted":
          setGranted(true);
          navigator.geolocation.getCurrentPosition(
            onPositionUpdate || noop,
            onPositionError,
            geolocationOptions
          );
          break;
        case "prompt":
          navigator.geolocation.getCurrentPosition(
            onPositionUpdate || noop,
            onPositionError,
            geolocationOptions
          );
          break;
        case "denied":
          navigator.geolocation.getCurrentPosition(
            onPositionUpdate || noop,
            onPositionError,
            geolocationOptions
          );
          setGranted(false);
          break;
      }
    };
    promptAsync();
  }, [noop, onPositionError, onPositionUpdate]);

  return granted;
};

export default useGeolocation;
