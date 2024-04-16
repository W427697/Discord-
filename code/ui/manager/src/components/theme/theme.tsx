import type { FC } from 'react';
import React from 'react';
import { styled } from '@storybook/theming';
import { BookmarkHollowIcon, ComponentIcon, DocumentIcon, FolderIcon } from '@storybook/icons';
import { ButtonGhost, ButtonOutline } from './button';

const Manager = styled.div({
  width: '100%',
  height: 440,
  display: 'flex',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: 6,
  overflow: 'hidden',
});

const Sidebar = styled.div<{ background: string }>(({ background }) => ({
  background: background,
  width: 250,
  height: '100%',
  flexShrink: 0,
  padding: 12,
  gap: 8,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid rgba(0, 0, 0, 0.1)',
}));

const Right = styled.div<{ background: string }>(({ background = 'white' }) => ({
  background: background,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const Toolbar = styled.div<{ background: string }>(({ background }) => ({
  height: 40,
  width: '100%',
  background: background,
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  padding: '0 6px',
  gap: 6,
}));

const Content = styled.div(() => ({
  flex: 1,
  background: 'white',
}));

const AddonsPanel = styled.div<{ background: string }>(({ background }) => ({
  height: 200,
  background: background,
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
}));

const Line = styled.div<{ active?: boolean; accent?: string }>(({ active, accent }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '0 8px',
  borderRadius: 4,
  height: 28,
  fontSize: 14,
  color: active ? 'white' : 'black',
  background: active ? accent : 'transparent',
}));

interface ThemeProps {
  accent: string;
  background: string;

  toolbarAccent: string;
  toolbarBackground: string;

  addonsPanelAccent: string;
  addonsPanelBackground: string;

  doc: string;
  group: string;
  component: string;
  story: string;
}

export const Theme: FC<ThemeProps> = ({
  background,
  accent,
  story,
  group,
  component,
  doc,
  toolbarAccent,
  toolbarBackground,
  addonsPanelAccent,
  addonsPanelBackground,
}) => {
  return (
    <Manager>
      <Sidebar background={background}>
        <Line>
          <BookmarkHollowIcon style={{ color: story }} />
          I'm a story
        </Line>
        <Line>
          <FolderIcon style={{ color: group }} />
          I'm a group
        </Line>
        <Line>
          <ComponentIcon style={{ color: component }} />
          I'm a component
        </Line>
        <Line>
          <DocumentIcon style={{ color: doc }} />
          I'm a document
        </Line>
        <Line active accent={accent}>
          <BookmarkHollowIcon style={{ color: 'white' }} /> Hello World
        </Line>
      </Sidebar>
      <Right background={background}>
        <Toolbar background={toolbarBackground}>
          <ButtonGhost accent={toolbarAccent} background={toolbarBackground} />
          <ButtonOutline accent={toolbarAccent} background={toolbarBackground} />
        </Toolbar>
        <Content />
        <AddonsPanel background={addonsPanelBackground} />
      </Right>
    </Manager>
  );
};
