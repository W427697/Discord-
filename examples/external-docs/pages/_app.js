import React from 'react';
import 'nextra-theme-docs/style.css';
import { ExternalDocsContainer } from '@storybook/addon-docs';
import * as reactAnnotations from '@storybook/react/dist/esm/client/preview/config';
import * as previewAnnotations from '../.storybook/preview';

const projectAnnotations = {
  ...reactAnnotations,
  ...previewAnnotations,
};

export default function Nextra({ Component, pageProps }) {
  return (
    <ExternalDocsContainer projectAnnotations={projectAnnotations}>
      <Component {...pageProps} />
    </ExternalDocsContainer>
  );
}
