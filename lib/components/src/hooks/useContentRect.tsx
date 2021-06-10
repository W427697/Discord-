import { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useCallbackRef } from './useCallbackRef';

export const useContentRect = (ref: any) => {
  const [element, attachRef] = useCallbackRef<any>();
  const [bounds, setBounds] = useState({
    height: 0,
    width: 0,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const onResize = ([entry]: ResizeObserverEntry[]) => {
      const newBounds = entry.target.getBoundingClientRect().toJSON();
      setBounds({
        ...bounds,
        ...newBounds,
      });
    };

    const observer = new ResizeObserver(onResize);

    if (element && element.current) {
      observer.observe(element.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [element]);

  useEffect(() => {
    attachRef(ref);
  }, [attachRef, ref]);

  return bounds;
};
