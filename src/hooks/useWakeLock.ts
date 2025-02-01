'use client';
import { useCallback, useEffect, useRef } from 'react';

interface NavigatorWithWakeLock extends Navigator {
  wakeLock: {
    // biome-ignore lint/suspicious/noExplicitAny: Wake lock APIを使っているから仕方ない
    request(type: 'screen'): Promise<any>;
  };
}

export const useWakeLock = (): (() => Promise<void>) => {
  // biome-ignore lint/suspicious/noExplicitAny: Wake lock APIを使っているから仕方ない
  const wakeLock = useRef<any>(null);

  const requestWakeLock = useCallback(async () => {
    const typedNavigator = navigator as NavigatorWithWakeLock;
    try {
      wakeLock.current = await typedNavigator.wakeLock.request('screen');
      console.log('Wake Lock is active');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(`${err.name}, ${err.message}`);
      } else {
        console.error('Unknown error occurred');
      }
    }
  }, []);

  const handleVisibilityChange = useCallback(async () => {
    if (wakeLock.current !== null && document.visibilityState === 'visible') {
      await requestWakeLock();
    }
  }, [requestWakeLock]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [handleVisibilityChange]);

  return requestWakeLock;
};
