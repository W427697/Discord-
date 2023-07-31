import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';

const Wrapper = styled.div({
  backgroundColor: 'red',
});

export const Empty: FC = () => <Wrapper>Hello World</Wrapper>;
