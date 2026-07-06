import { useEffect, useState } from "react";

let current: string | null = null;
const listeners = new Set<() => void>();

export function getStackFilter() {
  return current;
}

export function setStackFilter(tag: string | null) {
  current = tag;
  listeners.forEach((l) => l());
}

export function useStackFilter(): [string | null, (t: string | null) => void] {
  const [, setTick] = useState(0);
  useEffect(() => {
    const fn = () => setTick((n) => n + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return [current, setStackFilter];
}
