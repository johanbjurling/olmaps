"use client";

import { useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";

export function useBehaviorSubject<T>(subject$: BehaviorSubject<T>): T {
  const [value, setValue] = useState<T>(subject$.value);

  useEffect(() => {
    const sub = subject$.subscribe((newValue) => {
      setValue(newValue);
    });

    return () => sub.unsubscribe();
  }, [subject$]);

  return value;
}
