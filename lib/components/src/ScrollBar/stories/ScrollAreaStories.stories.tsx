import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { Content } from './Content';
import { ScrollArea } from '../ScrollArea';

export default {
  title: 'Basics/ScrollArea/Stories',
  component: ScrollArea,
  parameters: {
    test: { disable: true },
    actions: { disable: true },
    controls: { disable: true },
  },
} as ComponentMeta<typeof ScrollArea>;

export const Default = () => (
  <ScrollArea>
    <Content />
  </ScrollArea>
);

export const DefaultContentWidth = () => (
  <ScrollArea>
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const ContentWidthBoth = () => (
  <ScrollArea vertical horizontal>
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const AbsoluteVerticalOnly = () => (
  <ScrollArea absolute vertical>
    <Content />
  </ScrollArea>
);

export const AbsoluteForcedContentWidthBoth = () => (
  <ScrollArea absolute horizontal vertical>
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const FixedAreaSizeDefault = () => (
  <ScrollArea style={{ height: 250, width: 250 }}>
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const FixedAreaSizeVertical = () => (
  <ScrollArea vertical style={{ height: 250, width: 250 }}>
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const FixedAreaSizeHorizontal = () => (
  <ScrollArea horizontal style={{ height: 250, width: 250 }}>
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const FixedAreaSizeBoth = () => (
  <ScrollArea vertical horizontal style={{ height: 250, width: 250 }}>
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const BorderedArea = () => (
  <ScrollArea vertical style={{ height: 450, border: '10px solid #FF0000' }}>
    <div style={{ padding: 32 }}>
      <h1>Do not attempt to style the ScrollArea itself</h1>
      <h2>instead use the ContainerProps or ContentProps</h2>
      <p>
        Preferably ScrollArea knows nothing about styling other than what is given through
        properties
      </p>
      <p>
        Should you however need to style the container use the properties ContainerProps or
        ContentProps to add any valid React.HTMLAttribute to these nodes
      </p>
    </div>
    <Content />
  </ScrollArea>
);

export const BorderedContainer = () => (
  <ScrollArea
    vertical
    horizontal
    sliderColor="#FF0000"
    sliderOpacity={1}
    style={{ height: 250, width: 250 }}
    ContainerProps={{ style: { border: '14px solid #0000FF' } }}
  >
    <Content style={{ width: 2000 }} />
  </ScrollArea>
);

export const BorderedContent = () => (
  <ScrollArea
    vertical
    horizontal
    style={{ height: 250, width: 250 }}
    sliderColor="#FF0000"
    sliderOpacity={1}
  >
    <Content style={{ width: 2000, border: '14px solid #0000FF' }} />
  </ScrollArea>
);
