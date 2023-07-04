import React from 'react';
import type * as _NextImage from 'next/image';
import { ImageContext } from './context';
import { defaultLoader } from './next-image-default-loader';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore import is aliased in webpack config
const FutureNextImage = require('sb-original/next/future/image') as typeof _NextImage;

const OriginalNextFutureImage = FutureNextImage.default;

function NextFutureImage(props: _NextImage.ImageProps) {
  const imageParameters = React.useContext(ImageContext);

  return (
    <OriginalNextFutureImage
      {...imageParameters}
      {...props}
      loader={props.loader ?? defaultLoader}
    />
  );
}

export default NextFutureImage;
