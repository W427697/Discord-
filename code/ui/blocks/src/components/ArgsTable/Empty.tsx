import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { Icon, Link } from '@storybook/components/experimental';

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
  color: theme.textColor,
}));

const Description = styled.div(({ theme }) => ({
  fontWeight: theme.typography.weight.regular,
  fontSize: theme.typography.size.s2 - 1,
  textAlign: 'center',
  color: theme.textMutedColor,
}));

const Links = styled.div({
  display: 'flex',
  gap: 25,
});

const Divider = styled.div(({ theme }) => ({
  width: 1,
  height: 16,
  backgroundColor: theme.appBorderColor,
}));

const VideoIcon = styled.div(({ theme }) => ({
  width: 24,
  height: 18,
  borderRadius: theme.appBorderRadius,
  border: `1px solid ${theme.color.secondary}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
      <Link
        href="https://youtu.be/0gOfS6K0x0E"
        target="_blank"
        icon={
          <VideoIcon>
            <Icon.Play size={10} />
          </VideoIcon>
        }
        withArrow
      >
        Watch 5m video
      </Link>
      <Divider />
      <Link
        href="https://storybook.js.org/docs/react/writing-stories/args"
        target="_blank"
        withArrow
      >
        Read docs
      </Link>
    </Links>
  </Wrapper>
);
