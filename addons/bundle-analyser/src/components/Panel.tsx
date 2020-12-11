/* eslint-disable react/default-props-match-prop-types */
import { ANALYSER_ADDRESS } from 'global';
import React, { Fragment } from 'react';
// import { styled } from '@storybook/theming';
import { ScrollArea, Placeholder } from '@storybook/components';

interface Props {
  active: boolean;
}

const Panel = ({ active }: Props) =>
  active ? (
    <iframe
      style={{ margin: 0, border: 0, width: '100%' }}
      title="bundle-analyser"
      src={ANALYSER_ADDRESS}
    />
  ) : null;
Panel.defaultProps = {
  tests: null,
};

export default Panel;
