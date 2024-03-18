import React, { version as reactVersion } from 'react';
import { version as reactDomVersion } from 'react-dom';
import { version as reactDomServerVersion } from 'react-dom/server';

export const ResolvedReactVersion = () => {
  return (
    <>
      <p>
        <code>react</code>: <code data-testid="component-react">{reactVersion}</code>
      </p>
      <p>
        <code>react-dom</code>: <code data-testid="component-react-dom">{reactDomVersion}</code>
      </p>
      <p>
        <code>react-dom/server</code>:{' '}
        <code data-testid="component-react-dom-server">{reactDomServerVersion}</code>
      </p>
    </>
  );
};
