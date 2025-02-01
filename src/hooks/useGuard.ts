'use client';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { stationAtom } from '../atoms/station';

export const useGuard = () => {
  const router = useRouter();
  const { station } = useAtomValue(stationAtom);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!station) {
      setIsLoading(true);
      router.replace('/')
        .catch((error) => {
          console.error('Navigation failed:', error);
          // エラー処理を追加
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [router, station]);

  return { isLoading };
};
