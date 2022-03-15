/* global MutationObserver */
import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
  useMemo,
  RefObject,
  useCallback,
} from 'react';
import { styled } from '@storybook/theming';
import { browserSupportsCssZoom } from './browserSupportsCssZoom';

const ZoomElementWrapper = styled.div<{ scale: number; height: number }>(({ scale = 1, height }) =>
  browserSupportsCssZoom()
    ? {
        '> *': {
          zoom: 1 / scale,
        },
      }
    : {
        height: height + 50,
        transformOrigin: 'top left',
        transform: `scale(${1 / scale})`,
      }
);

const useMutationObserver = ({
  element,
  options = {},
  callback,
}: {
  element: RefObject<Element>;
  options: MutationObserverInit;
  callback: MutationCallback;
}): void => {
  const observer = useMemo(
    () =>
      typeof MutationObserver === 'function'
        ? new MutationObserver((mutationRecord, mutationObserver) => {
            callback?.(mutationRecord, mutationObserver);
          })
        : undefined,
    [callback]
  );

  useEffect(() => {
    if (observer && element?.current) {
      observer.observe(element.current, options);
    }

    return () => observer?.disconnect();
  }, [element, observer, options]);
};

type ZoomProps = {
  scale: number;
  children: ReactElement | ReactElement[];
};

export function ZoomElement({ scale, children }: ZoomProps) {
  const componentWrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const handleMutations = useCallback(() => {
    setHeight(componentWrapperRef.current.getBoundingClientRect().height);
  }, []);

  useEffect(() => {
    if (componentWrapperRef.current) {
      setHeight(componentWrapperRef.current.getBoundingClientRect().height);
    }
  }, [scale, componentWrapperRef.current]);

  useMutationObserver({
    element: componentWrapperRef,
    options: { subtree: true, childList: true },
    callback: handleMutations,
  });

  return (
    <ZoomElementWrapper scale={scale} height={height}>
      <div
        ref={browserSupportsCssZoom() ? null : componentWrapperRef}
        className="innerZoomElementWrapper"
      >
        {children}
      </div>
    </ZoomElementWrapper>
  );
}
