import { useCallback, useState } from "react";

export function useControllable<T>(
  value: T | undefined,
  onChange: ((next: T) => void) | undefined,
  defaultValue: T
): readonly [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const resolved = isControlled ? value : internal;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  return [resolved, setValue] as const;
}
