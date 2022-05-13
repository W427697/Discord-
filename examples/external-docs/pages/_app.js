/* eslint-disable react/prop-types */
import React from 'react';
import 'nextra-theme-docs/style.css';
import { ExternalDocsContainer } from '@storybook/addon-docs';
import { composeConfigs } from '@storybook/store';
import * as reactAnnotations from '@storybook/react/dist/esm/client/preview/config';
import * as docsAnnotations from '@storybook/react/dist/esm/client/docs/config';
import * as previewAnnotations from '../.storybook/preview';

const projectAnnotations = composeConfigs([reactAnnotations, docsAnnotations, previewAnnotations]);

export default function Nextra({ Component, pageProps }) {
  return (
    <ExternalDocsContainer projectAnnotations={projectAnnotations}>
      <Component {...pageProps} />
    </ExternalDocsContainer>
  );
}
