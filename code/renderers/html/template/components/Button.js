/* eslint-disable no-undef */
export const Button = (args) => {
  const button = document.createElement('button');

  button.innerHTML = args.children;
  button.addEventListener('click', args.onClick);

  return button;
};
