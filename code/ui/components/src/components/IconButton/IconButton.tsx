import React, { forwardRef } from 'react';
import type { ButtonProps } from '../Button/Button';
import { Button } from '../Button/Button';

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ padding = 'small', ...props }, ref) => {
    return <Button padding={padding} ref={ref} {...props} />;
  }
);

IconButton.displayName = 'IconButton';
