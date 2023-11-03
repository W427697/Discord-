import React from 'react';
import './button.css';

/**
 * Primary UI component for user interaction
 * @param {object} props
 * @param {string} [props.primary]
 * @param {string} [props.backgroundColor = null]
 * @param {('small' | 'medium' | 'large')} [props.size='medium']
 * @param {string} props.label
 * @param {function} [props.onClick]
 */
export const Button = ({
  primary = false,
  backgroundColor = null,
  size = 'medium',
  label,
  ...props
}) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      {...props}
    >
      {label}
      <style jsx>{`
        button {
          background-color: ${backgroundColor};
        }
      `}</style>
    </button>
  );
};
