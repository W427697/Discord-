import React from 'react';
import styled from '@emotion/styled';

import { withNotes } from '@storybook/addon-notes';
import { withEditor } from '../../other/withEditor';

import SideBySide from './side-by-side';
import WrappingInline from './wrapping-inline';
import { Placeholder, PageTemplate } from './placeholder';

const Holder = styled.div({
  margin: 10,
  border: '1px dashed deepskyblue',
});

export default {
  title: 'Components|Layout',
  decorators: [withNotes, withEditor],

  parameters: {
    notes: { markdown: require('./readme.md') },
  },
};

export const sidebyside = () => ({ Holder, SideBySide, Placeholder });

sidebyside.story = {
  name: 'sidebyside',
  parameters: {
    editor: `
      <Holder>
        <SideBySide>
          <Placeholder color="hotpink">content 1</Placeholder>
          <Placeholder color="deepskyblue">content 2</Placeholder>
        </SideBySide>
      </Holder>
    `,
  },
};

const Placeholder1 = () => (
  <Placeholder inline color="hotpink">
    placeholder 1
  </Placeholder>
);
const Placeholder2 = () => (
  <Placeholder inline color="deepskyblue">
    placeholder 2
  </Placeholder>
);
const Placeholder3 = () => (
  <Placeholder inline color="orangered">
    placeholder 3
  </Placeholder>
);
const Placeholder4 = () => (
  <Placeholder inline color="deeppink">
    placeholder 4
  </Placeholder>
);

export const wrappingLine = () => ({
  Holder,
  WrappingInline,
  Placeholder1,
  Placeholder2,
  Placeholder3,
  Placeholder4,
});

wrappingLine.story = {
  name: 'wrapping line',
  parameters: {
    editor: `
      <Holder>
        <WrappingInline>
          <Placeholder1/>
          <Placeholder2/>
          <Placeholder3/>
          <Placeholder4/>
        </WrappingInline>
      </Holder>
    `,
  },
};

export const wrappingLineAligned = () => ({
  Holder,
  WrappingInline,
  Placeholder1,
  Placeholder2,
  Placeholder3,
  Placeholder4,
});

wrappingLineAligned.story = {
  name: 'wrapping line aligned',
  parameters: {
    editor: `
      <Holder>
        <WrappingInline align="center">
          <Placeholder1/>
          <Placeholder2/>
          <Placeholder3/>
          <Placeholder4/>
        </WrappingInline>
      </Holder>
    `,
  },
};

export const pageTemplate = () => ({
  PageTemplate,
  Placeholder1,
  Placeholder2,
  Placeholder3,
  Placeholder4,
});

pageTemplate.story = {
  name: 'a page template',
  parameters: {
    editor: `
      <PageTemplate>
        <Placeholder1/>
        <Placeholder2/>
        <Placeholder3/>
        <Placeholder4/>
      </PageTemplate>
    `,
  },
};
