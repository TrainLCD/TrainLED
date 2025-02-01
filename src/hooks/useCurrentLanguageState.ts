import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { navigationAtom } from '../atoms/navigation';

export type LanguageState = 'ja' | 'jaKana' | 'en';

const useCurrentLanguageState = () => {
  const [language, setLanguage] = useState<LanguageState>('ja');
  const { approaching, arrived } = useAtomValue(navigationAtom);

  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage((prev) => {
        switch (prev) {
          case 'ja':
            return 'jaKana';
          case 'jaKana':
            return 'en';
          case 'en':
            return 'ja';
          default:
            return prev;
        }
      });
    }, 3 * 1000);
    return () => clearInterval(interval);
  }, []);

  return language;
};

export default useCurrentLanguageState;
