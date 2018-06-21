import { h } from 'hyperapp';

const Button = (attributes, children) => (
  <button {...attributes} type={attributes.type || 'button'}>
    {children}
  </button>
);

export default Button;
