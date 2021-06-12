import { useState, RefObject, useCallback, useLayoutEffect } from 'react';

const isBrowser = typeof window !== 'undefined';

export type ScrollState = { scrollLeft: number; scrollTop: number };

export const useScroll = (ref: RefObject<HTMLDivElement>) => {
  const [scrollState, setScrollState] = useState<ScrollState>();

  const handleScrollChange = useCallback(() => {
    console.log(ref);
  }, []);

  useLayoutEffect(() => {
    // eslint-disable-next-line no-undef
    window.addEventListener('scroll', handleScrollChange);

    return () => {
      // eslint-disable-next-line no-undef
      window.removeEventListener('scroll', handleScrollChange);
    };
  }, []);

  return scrollState;
};
