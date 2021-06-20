import { useState, useCallback, RefObject } from 'react';

// @TODO should be React.MutableRefObject....
export function useCallbackRef<T extends HTMLElement = HTMLElement>() {
  const [ref, setRef] = useState<RefObject<T | null>>(null);
  const fn = useCallback(
    (node: RefObject<T | null>) => {
      setRef(node);
    },
    [setRef]
  );

  return { ref, fn };
}
