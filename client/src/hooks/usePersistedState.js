import { useState, useEffect, useMemo } from "react";

const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    // Get the persisted state from local storage
    const persistedState = localStorage.getItem(key);
    return persistedState ? JSON.parse(persistedState) : defaultValue;
  });

  // Update the local storage whenever the state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  // Memoize the state to avoid re-rendering if the state is unchanged
  const memoizedState = useMemo(() => state, [state]);

  return [memoizedState, setState];
};

export default usePersistedState;
