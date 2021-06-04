import React, { FunctionComponent } from 'react';

import { styled } from '@storybook/theming';
import { Result } from 'axe-core';
import { Tags } from './Tags';

const Wrapper = styled.div({
  marginBottom: 24,
});

const Help = styled.p({
  margin: '0 0 12px',
});

const Link = styled.a({
  marginTop: 12,
  textDecoration: 'underline',
  color: 'inherit',
  display: 'block',
});

interface InfoProps {
  item: Result;
}

export const Info: FunctionComponent<InfoProps> = ({ item }) => {
  return (
    <Wrapper>
      <Help>{item.help}</Help>
      <Tags tags={item.tags} key="tags" />
      <Link href={item.helpUrl} target="_blank">
        More info...
      </Link>
    </Wrapper>
  );
};
