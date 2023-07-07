/* eslint-disable no-nested-ternary */
import type { FC } from 'react';
import React, { useState } from 'react';
import { styled, typography } from '@storybook/theming';
import type { State } from '@storybook/manager-api';

import { Button as BaseButton, Icons, StorybookIcon } from '@storybook/components';

const Header = styled.header(({ theme }) => ({
  marginBottom: 32,
  fontSize: theme.typography.size.l2,
  color: theme.base === 'light' ? theme.color.darkest : theme.color.lightest,
  fontWeight: theme.typography.weight.bold,
  alignItems: 'center',
  display: 'flex',

  '> svg': {
    height: 48,
    width: 'auto',
    marginRight: 8,
  },
}));

const Container = styled.div({
  display: `flex`,
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100% - 40px)',
  flexDirection: 'column',
});

export const UpgradeBlock = styled.div(({ theme }) => {
  return {
    border: '1px solid',
    borderRadius: 5,
    padding: 20,
    margin: 20,
    maxWidth: 400,
    borderColor: theme.color.border,
    fontSize: theme.typography.size.s2,
  };
});

const Code = styled.pre`
  background: rgba(0, 0, 0, 0.05);
  font-size: ${typography.size.s2 - 1}px;
  margin: 4px 0 16px;
`;

const Footer = styled.div(({ theme }) => ({
  marginBottom: 24,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: theme.base === 'light' ? theme.color.dark : theme.color.lightest,
  fontWeight: theme.typography.weight.regular,
  fontSize: theme.typography.size.s2,
}));

export const Button = styled(BaseButton)(({ theme }) => ({
  '&&': {
    borderRadius: 4,
    fontSize: '13px',
    lineHeight: '14px',
    color: theme.base === 'light' ? theme.color.darker : theme.color.lightest,
    padding: '9px 12px',
    svg: {
      marginRight: 6,
    },
  },
}));

const Tab = styled(Button)<{ active: boolean }>(({ theme, active }) => ({
  '&&': {
    padding: 2,
    paddingRight: 8,
    margin: 0,
    color: active
      ? theme.color.secondary
      : theme.base === 'light'
      ? theme.color.dark
      : theme.color.lightest,
  },
}));

const BlueLinkButton = styled(Button)(({ theme }) => ({
  '&&': {
    padding: 0,
    paddingRight: 8,
    margin: 0,
    color: theme.color.secondary,
    fontSize: theme.typography.size.s2,
    fontWeight: theme.typography.weight.regular,
  },
}));

export const StyledA = styled.a(({ theme }) => ({
  '&&': {
    textDecoration: 'none',
    fontWeight: theme.typography.weight.bold,
    color: theme.base === 'light' ? theme.color.dark : theme.color.light,
  },
  '&:hover': {
    color: theme.base === 'light' ? theme.color.darkest : theme.color.lightest,
  },
}));

const AboutScreen: FC<{
  current: State['versions']['current'];
  onNavigateToWhatsNew?: () => void;
}> = ({ current, onNavigateToWhatsNew }) => {
  const [activeTab, setActiveTab] = useState<'npm' | 'pnpm'>('npm');
  return (
    <Container>
      <div style={{ flex: '1' }} />
      <Header>
        <StorybookIcon /> Storybook
      </Header>
      <UpgradeBlock>
        <strong>You are on Storybook {current.version}</strong>
        <p>Run the following script to check for updates and upgrade to the latest version.</p>
        <div>
          <Tab small active={activeTab === 'npm'} onClick={() => setActiveTab('npm')}>
            npm
          </Tab>
          <Tab active={activeTab === 'pnpm'} small onClick={() => setActiveTab('pnpm')}>
            pnpm
          </Tab>
        </div>

        <Code>
          {activeTab === 'npm'
            ? 'npx storybook@latest upgrade'
            : 'pnpm dlx storybook@latest upgrade'}
        </Code>
        {onNavigateToWhatsNew && (
          <BlueLinkButton onClick={onNavigateToWhatsNew}>
            See what's new in Storybook
          </BlueLinkButton>
        )}
      </UpgradeBlock>

      <div style={{ flex: '1.2' }} />
      <Footer>
        <div style={{ marginBottom: 12 }}>
          <Button
            isLink
            outline
            small
            href="https://github.com/storybookjs/storybook"
            style={{ marginRight: 12 }}
          >
            <Icons icon="github" style={{ display: 'inline', marginRight: 5 }} />
            GitHub
          </Button>

          <Button isLink outline small href="https://storybook.js.org/docs">
            <Icons icon="document" style={{ display: 'inline', marginRight: 5 }} />
            Documentation
          </Button>
        </div>
        <div>
          Open source software maintained by{' '}
          <StyledA href="https://www.chromatic.com/">Chromatic</StyledA> and the{' '}
          <StyledA href="https://github.com/storybookjs/storybook/graphs/contributors">
            Storybook Community
          </StyledA>
        </div>
      </Footer>
    </Container>
  );
};

export { AboutScreen };
