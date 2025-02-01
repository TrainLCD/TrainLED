'use client';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { stationAtom } from '../atoms/station';

export const useGuard = () => {
  const router = useRouter();
  const { station } = useAtomValue(stationAtom);

  useEffect(() => {
    if (!station) {
      router.replace('/');
    }
  }, [router, station]);
};
