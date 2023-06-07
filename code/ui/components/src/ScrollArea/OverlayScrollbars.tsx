import type { FC } from 'react';
import React, { useRef, useEffect } from 'react';
import type { UseOverlayScrollbarsParams } from 'overlayscrollbars-react';

import { useOverlayScrollbars } from 'overlayscrollbars-react';

export const OverlayScrollbarsComponent: FC<{
  options: UseOverlayScrollbarsParams['options'];
  className?: string;
}> = ({
  options = {},

  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement>();
  const [initialize] = useOverlayScrollbars({ options });

  useEffect(() => {
    initialize(ref.current);
  }, [initialize]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};

export default OverlayScrollbarsComponent;
