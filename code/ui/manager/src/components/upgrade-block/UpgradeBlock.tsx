import type { FC } from 'react';
import React, { useState } from 'react';
import { styled } from '@storybook/theming';
import { useStorybookApi } from '@storybook/manager-api';
import { Button, Link } from '@storybook/components';

interface UpgradeBlockProps {
  onNavigateToWhatsNew?: () => void;
}

export const UpgradeBlock: FC<UpgradeBlockProps> = ({ onNavigateToWhatsNew }) => {
  const api = useStorybookApi();
  const [activeTab, setActiveTab] = useState<'npm' | 'pnpm'>('npm');

  return (
    <Container>
      <strong>You are on Storybook {api.getCurrentVersion().version}</strong>
      <p>Run the following script to check for updates and upgrade to the latest version.</p>
      <Tabs>
        <Button primary={activeTab === 'npm'} onClick={() => setActiveTab('npm')}>
          npm
        </Button>
        <Button primary={activeTab === 'pnpm'} onClick={() => setActiveTab('pnpm')}>
          pnpm
        </Button>
      </Tabs>
      <Code>
        {activeTab === 'npm' ? 'npx storybook@latest upgrade' : 'pnpm dlx storybook@latest upgrade'}
      </Code>
      {onNavigateToWhatsNew && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link onClick={onNavigateToWhatsNew}>See what's new in Storybook</Link>
      )}
    </Container>
  );
};

const Container = styled.div(({ theme }) => ({
  border: '1px solid',
  borderRadius: 5,
  padding: 20,
  marginTop: 0,
  maxWidth: 400,
  borderColor: theme.appBorderColor,
  fontSize: theme.typography.size.s2,
  width: '100%',
}));

const Tabs = styled.div({
  display: 'flex',
  gap: 2,
});

const Code = styled.pre(({ theme }) => ({
  background: theme.base === 'light' ? 'rgba(0, 0, 0, 0.05)' : theme.appBorderColor,
  fontSize: theme.typography.size.s2 - 1,
  margin: '4px 0 16px',
}));
