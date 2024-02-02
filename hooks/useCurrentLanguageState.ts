import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { navigationAtom } from "../atoms/navigation";

export type LanguageState = "ja" | "jaKana" | "en" | "jaBound" | "enBound";

const useCurrentLanguageState = () => {
  const [language, setLanguage] = useState<LanguageState>("ja");
  const { approaching, arrived } = useAtomValue(navigationAtom);

  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage((prev) => {
        switch (prev) {
          case "ja":
            return "jaKana";
          case "jaKana":
            return "en";
          case "en":
            if (approaching && arrived) {
              return "ja";
            }
            return "jaBound";
          case "jaBound":
            return "enBound";
          case "enBound":
            return "ja";
          default:
            return prev;
        }
      });
    }, 3 * 1000);
    return () => clearInterval(interval);
  }, [approaching, arrived]);

  return language;
};

export default useCurrentLanguageState;
