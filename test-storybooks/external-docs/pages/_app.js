/* eslint-disable react/prop-types */
import React from 'react';
import 'nextra-theme-docs/style.css';
import { ExternalDocs } from '@junk-temporary-prototypes/addon-docs';

import * as reactAnnotations from '@junk-temporary-prototypes/react/preview';
import * as previewAnnotations from '../.storybook/preview';

export default function Nextra({ Component, pageProps }) {
  return (
    <ExternalDocs projectAnnotationsList={[reactAnnotations, previewAnnotations]}>
      <Component {...pageProps} />
    </ExternalDocs>
  );
}
