import React from 'react';
import { useChannel } from '@storybook/addons';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';
import { Page } from '../components/page/Page';

export default {
  title: 'Addons/Highlight',
  component: Page,
};

const Template = () => <Page />;

export const OneSelector = Template.bind({});
OneSelector.decorators = [
  (story) => {
    const emit = useChannel({});

    emit(HIGHLIGHT, {
      elements: ['.page-title'],
    });

    return story();
  },
];

export const MultipleSelectors = Template.bind({});
MultipleSelectors.decorators = [
  (story) => {
    const emit = useChannel({});

    emit(HIGHLIGHT, {
      elements: ['a', 'button'],
    });

    return story();
  },
];

export const CustomColor = Template.bind({});
CustomColor.decorators = [
  (story) => {
    const emit = useChannel({});

    emit(HIGHLIGHT, {
      elements: ['.tip-wrapper'],
      color: '#6c1d5c',
      style: 'solid',
    });

    return story();
  },
];

export const OutlineStyle = Template.bind({});
OutlineStyle.decorators = [
  (story) => {
    const emit = useChannel({});

    emit(HIGHLIGHT, {
      elements: ['.page-title'],
      color: '#6c1d5c',
      style: 'double',
    });

    return story();
  },
];

export const MultipleEvents = Template.bind({});
MultipleEvents.decorators = [
  (story) => {
    const emit = useChannel({});

    emit(HIGHLIGHT, {
      elements: ['.tip-wrapper'],
      color: '#6c1d5c',
      style: 'solid',
    });

    emit(HIGHLIGHT, {
      elements: ['ul'],
      color: '#6c1d5c',
      style: 'dotted',
    });
    return story();
  },
];

export const Reset = Template.bind({});
Reset.decorators = [
  (story) => {
    const emit = useChannel({});

    emit(HIGHLIGHT, {
      elements: ['ul'],
      color: '#6c1d5c',
      style: 'dotted',
    });

    emit(RESET_HIGHLIGHT);

    return story();
  },
];
