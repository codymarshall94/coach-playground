import { useEffect, useState } from "react";

export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      setValue(JSON.parse(item));
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
