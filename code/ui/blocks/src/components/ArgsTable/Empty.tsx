import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/components/experimental';

const Wrapper = styled.div({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 15,
});

const Content = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  maxWidth: 415,
});

const Title = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.bold,
  fontSize: theme.typography.size.s2 - 1,
  textAlign: 'center',
}));

const Description = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.regular,
  fontSize: theme.typography.size.s2 - 1,
  textAlign: 'center',
}));

const Links = styled.div(({ theme }) => ({
  display: 'flex',
  gap: 25,
}));

export const Empty: FC = () => (
  <Wrapper>
    <Content>
      <Title>Interactive story playground</Title>
      <Description>
        Controls give you an easy to use interface to test your components. Set your story args and
        you&apos;ll see controls appearing here automatically.
      </Description>
    </Content>
    <Links>
      <Link href="http://google.com" withArrow>
        Watch 5m video
      </Link>
      <Link href="http://google.com" withArrow>
        Read docs
      </Link>
    </Links>
  </Wrapper>
);
