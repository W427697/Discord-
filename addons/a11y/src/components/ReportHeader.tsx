import React from 'react';
import { styled } from '@storybook/theming';
import { Tags } from './Tags';

/* eslint-disable import/order */
import type { Result } from 'axe-core';

interface ReportInfoProps {
  item: Result;
}

export const ReportHeader = ({ item }: ReportInfoProps) => {
  return (
    <Wrapper>
      <Help>{item.help}</Help>
      <Link href={item.helpUrl} target="_blank">
        Learn more...
      </Link>
      <Tags tags={item.tags} key="tags" />
    </Wrapper>
  );
};

const Wrapper = styled.div({});

const Help = styled.div({
  marginBottom: 4,
});

const Link = styled.a({
  marginBottom: 16,
  textDecoration: 'underline',
  display: 'inline-block',
});
