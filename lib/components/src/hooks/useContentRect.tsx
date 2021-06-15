import { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { useCallbackRef } from './useCallbackRef';

const isStateDirty = (a: UseContentRectBounds, b: UseContentRectBounds) => {
  return JSON.stringify(a) !== JSON.stringify(b);
};

export interface UseContentRectBounds {
  height: number;
  width: number;
  left: number;
  top: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
}

export const useContentRect = (ref: any) => {
  const { ref: element, fn: attachRef } = useCallbackRef<any>();
  const [bounds, setBounds] = useState<UseContentRectBounds>({
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
      const isDirty = isStateDirty(bounds, newBounds);

      if (isDirty) {
        setBounds(newBounds);
      }
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
