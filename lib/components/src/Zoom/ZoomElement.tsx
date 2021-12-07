/* global MutationObserver */
import React, { ReactElement, RefObject, useCallback, useEffect, useMemo, useState } from 'react';
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
type ZoomProps = {
  scale: number;
  children: ReactElement | ReactElement[];
};

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
      new MutationObserver((mutationRecord, mutationObserver) => {
        callback?.(mutationRecord, mutationObserver);
      }),
    [callback]
  );

  useEffect(() => {
    if (observer && element?.current) {
      observer.observe(element.current, options);
    }

    return () => observer?.disconnect();
  }, [element, observer, options]);
};

export function ZoomElement({ scale, children }: ZoomProps) {
  const componentWrapperRef = React.useRef(null);
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
      <div ref={componentWrapperRef} className="innerZoomElementWrapper">
        {children}
      </div>
    </ZoomElementWrapper>
  );
}
