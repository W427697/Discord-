// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore import is aliased in webpack config
import OriginalNextLegacyImage from 'sb-original/next/legacy/image';
import type * as _NextLegacyImage from 'next/legacy/image';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { ImageContext } from '@storybook/nextjs/dist/image-context';
import { defaultLoader } from './next-image-default-loader';

function NextLegacyImage({ loader, ...props }: _NextLegacyImage.ImageProps) {
  const imageParameters = React.useContext(ImageContext);

  return (
    <OriginalNextLegacyImage {...imageParameters} {...props} loader={loader ?? defaultLoader} />
  );
}

export default NextLegacyImage;
