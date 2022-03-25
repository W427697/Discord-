import React, { useEffect } from 'react';
import { useChannel } from '@storybook/addons';
import { HIGHLIGHT, RESET_HIGHLIGHT } from '@storybook/addon-highlight';
import { Page } from '../components/page/Page';

export default {
  title: 'Addons/Highlight',
  component: Page,
};

export const OneSelector = () => {
  const emit = useChannel({});

  useEffect(() => {
    emit(HIGHLIGHT, {
      elements: ['.page-title'],
    });
  }, []);

  return <Page />;
};

export const MultipleSelectors = () => {
  const emit = useChannel({});

  useEffect(() => {
    emit(HIGHLIGHT, {
      elements: ['a', 'button'],
    });
  }, []);

  return <Page />;
};

export const CustomColor = () => {
  const emit = useChannel({});

  useEffect(() => {
    emit(HIGHLIGHT, {
      elements: ['.tip-wrapper'],
      color: '#6c1d5c',
      style: 'solid',
    });
  }, []);

  return <Page />;
};

export const OutlineStyle = () => {
  const emit = useChannel({});

  useEffect(() => {
    emit(HIGHLIGHT, {
      elements: ['.page-title'],
      color: '#6c1d5c',
      style: 'double',
    });
  }, []);

  return <Page />;
};

export const MultipleEvents = () => {
  const emit = useChannel({});

  useEffect(() => {
    // It should apply only the most recent highlight
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
  }, []);

  return <Page />;
};

export const Reset = () => {
  const emit = useChannel({});

  useEffect(() => {
    // It should clear the highlight
    emit(HIGHLIGHT, {
      elements: ['ul'],
      color: '#6c1d5c',
      style: 'dotted',
    });

    emit(RESET_HIGHLIGHT);
  }, []);

  return <Page />;
};
