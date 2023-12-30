import { useEffect, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import usePersistedState from "./usePersistedState";

const useColorScheme = () => {
  const systemPrefersDark = useMediaQuery(
    { query: "(prefers-color-scheme: dark)" },
    undefined
  );

  const [isDark, setIsDark] = usePersistedState("colorScheme", undefined);

  const value = useMemo(
    () => (isDark === undefined ? systemPrefersDark : isDark),
    [isDark, systemPrefersDark]
  );

  useEffect(() => {
    if (value) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [value]);

  return { isDark, setIsDark };
};

export default useColorScheme;
