import React, { FunctionComponent, AnchorHTMLAttributes } from 'react';

export const Link: FunctionComponent<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  children,
  ...props
}) => {
  const isAnchorUrl = /^#.*/.test(href);
  const target = isAnchorUrl ? '_self' : '_top';

  return (
    <a href={href} target={target} {...props}>
      {children}
    </a>
  );
};
