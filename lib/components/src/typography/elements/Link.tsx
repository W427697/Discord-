import React, { FunctionComponent, AnchorHTMLAttributes } from 'react';

export const Link: FunctionComponent<AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href: input,
  children,
  ...props
}) => {
  // If storybook is hosted at a non-root path (e.g. `/storybook/`),
  // the base url needs to be prefixed to storybook paths.
  let storybookBaseUrl = '/';
  if (typeof window !== 'undefined') {
    try {
      storybookBaseUrl = window.parent.document.location.pathname;
    } catch (error) {
      // For composed storybooks this doesn't work due to a CORS error
    }
  }
  if (!storybookBaseUrl.endsWith('/')) storybookBaseUrl += '/';

  const isStorybookPath = /^\//.test(input);
  const isAnchorUrl = /^#.*/.test(input);
  const href = isStorybookPath ? `${storybookBaseUrl}?path=${input}` : input;
  const target = isAnchorUrl ? '_self' : '_top';

  return (
    <a href={href} target={target} {...props}>
      {children}
    </a>
  );
};
