import type { FC } from 'react';
import React, { Fragment } from 'react';
import type { Addon_BaseType } from '@storybook/types';
import { Addon_TypesEnum } from '@storybook/types';
import type { ApplyWrappersProps, Wrapper } from './utils/types';
import { IframeWrapper } from './utils/components';

export const ApplyWrappers: FC<ApplyWrappersProps> = ({
  wrappers,
  id,
  storyId,
  active,
  children,
}) => {
  return (
    <Fragment>
      {wrappers.reduceRight(
        (acc, wrapper, index) => wrapper.render({ index, children: acc, id, storyId, active }),
        children
      )}
    </Fragment>
  );
};

export const defaultWrappers: Wrapper[] = [
  {
    render: (p) => (
      <IframeWrapper id="storybook-preview-wrapper" hidden={!p.active}>
        {(p as any).children}
      </IframeWrapper>
    ),
  },
];
