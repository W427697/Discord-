import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import global from 'global';
import {
  install as installResizeObserver,
  ResizeObserver as WindowResizeObserver,
} from 'resize-observer';
import { useCallbackRef } from '../useCallbackRef';

const window = global.window as Window & { ResizeObserver: typeof WindowResizeObserver };
const { ResizeObserver } = window;

if (!window.ResizeObserver) {
  installResizeObserver();
}

const initialState = {
  height: 0,
  width: 0,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
};

export type UseDOMRectBounds = typeof initialState;

export type UseDOMRectBoundsKeys = keyof UseDOMRectBounds;

const isStateDirty = (a: UseDOMRectBounds, b: UseDOMRectBounds) => {
  // You can not iterate a DOMRect with Object.keys - so we use the initialState mock
  return !Object.keys(initialState).every((k: UseDOMRectBoundsKeys) => a[k] === b[k]);
};

const getRoundedValues = (a: UseDOMRectBounds) => {
  const b = { ...initialState };

  // `Math.round` is in line with how CSS resolves sub-pixel values
  // You can not iterate a DOMRect with Object.keys - so we use the initialState mock
  Object.keys(b).forEach((k: UseDOMRectBoundsKeys) => {
    b[k] = Math.round(a[k]);
  });

  return b as DOMRect;
};

export interface UseDOMRectProps {
  rounded?: boolean;
  live?: boolean;
}

/**
 * **@storybook/addons/useDOMRect**
 *
 * Hook that returns a reference object to use, and a DOMRect description of the size
 * and position of this DOM node everytime one of its properties changes
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 *
 * #### Example:
 * ```
 * const Component = () => {
 *   const { ref, DOMRect: { width } } = useDOMRect<HTMLSpanElement>();
 *   return (<span ref={ref}>{`I am ${width}px wide`}</span>)
 * }
 * ```
 *
 */
export const useDOMRect = <T extends HTMLElement = HTMLDivElement>({
  rounded,
  live,
}: UseDOMRectProps = {}) => {
  const internalRef = useRef<T>(null);
  const { ref, fn: attachRef } = useCallbackRef<T>();
  const [bounds, setBounds] = useState<UseDOMRectBounds>({ ...initialState });

  useEffect(() => {
    let observer: WindowResizeObserver;

    if (live) {
      const onResize = ([entry]: ResizeObserverEntry[]) => {
        let newBounds = entry.target.getBoundingClientRect();
        const isDirty = isStateDirty(bounds, newBounds);

        if (isDirty) {
          if (rounded) {
            newBounds = getRoundedValues(newBounds);
          }

          setBounds(newBounds);
        }
      };

      observer = new ResizeObserver(onResize);
    }

    if (ref && ref.current) {
      if (observer) {
        observer.observe(ref.current);
      }

      const newBounds = ref.current.getBoundingClientRect();
      setBounds(newBounds);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [ref]);

  useLayoutEffect(() => {
    attachRef(internalRef);
  }, [attachRef, internalRef]);

  return { ref, DOMRect: bounds as DOMRect };
};
