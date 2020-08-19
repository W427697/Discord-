import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * A label to show on the button
   */
  label: string;
  /**
   * What background color to use
   */
  backgroundColor?: string;
}

export const Button = ({ label = 'Hello', backgroundColor, ...props }: ButtonProps) => (
  <button type="button" style={{ backgroundColor }} {...props}>
    {label}
  </button>
);
