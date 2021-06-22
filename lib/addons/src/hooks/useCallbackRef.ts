import { useState, useCallback, MutableRefObject } from 'react';

// @TODO should be React.MutableRefObject....
export function useCallbackRef<T extends HTMLElement = HTMLElement>() {
  const [callbackRef, setRef] = useState<MutableRefObject<T | null>>(null);
  const setCallbackRef = useCallback(
    (ref: MutableRefObject<T | null>) => {
      setRef(ref);
    },
    [setRef]
  );

  return { callbackRef, setCallbackRef };
}
