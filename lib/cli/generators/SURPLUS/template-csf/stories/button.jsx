import * as Surplus from 'surplus';

export default ({ children, type = 'button', ...props }) => (
  <button type={type} {...props}>
    {children}
  </button>
);
