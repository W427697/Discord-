import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { Button, Icon } from '@storybook/components/experimental';

const Container = styled.div(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  bottom: 0,
  left: 0,
  width: '100%',
  height: 40,
  zIndex: 10,
  background: theme.background.content,
  padding: '0 15px',
  borderTop: `1px solid ${theme.appBorderColor}`,
}));

const Left = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const StoryName = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
}));

export const MobileNavigation: FC = () => {
  return (
    <Container>
      <Left>
        <Button size="small" variant="tertiary" iconOnly icon={<Icon.Menu />}>
          Primary
        </Button>
        <StoryName>Story name</StoryName>
      </Left>
      <Button size="small" variant="tertiary" iconOnly icon={<Icon.BottomBarToggle />}>
        Addons
      </Button>
    </Container>
  );
};
