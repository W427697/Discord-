import React from 'react';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const Link = ({ href: input, children, ...props }: LinkProps) => {
  const isStorybookPath = /^\//.test(input);
  const isAnchorUrl = /^#.*/.test(input);
  const href = isStorybookPath ? `./?path=${input}` : input;
  const target = isAnchorUrl ? '_self' : '_top';

  return (
    <a href={href} target={target} {...props}>
      {children}
    </a>
  );
};
