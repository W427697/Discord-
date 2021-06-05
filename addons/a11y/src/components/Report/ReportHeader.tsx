import React from 'react';

import { styled } from '@storybook/theming';
import { Result } from 'axe-core';
import { Tags } from './Tags';

interface ReportInfoProps {
  item: Result;
}

export const ReportHeader = ({ item }: ReportInfoProps) => {
  return (
    <Wrapper>
      <Help>{item.help}</Help>
      <Link href={item.helpUrl} target="_blank">
        More info...
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
  color: 'inherit',
  display: 'block',
});
