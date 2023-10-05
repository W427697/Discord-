import { styled } from '@storybook/theming';
import type { Color, Theme } from '@storybook/theming';
import { Icons } from '@storybook/components';
import { transparentize } from 'polished';
import type { FC, ComponentProps } from 'react';
import React from 'react';
import { CollapseIcon } from './components/CollapseIcon';

const iconColors = {
  light: {
    document: '#ff8300',
    docsModeDocument: 'secondary',
    bookmarkhollow: 'seafoam',
    component: 'secondary',
    folder: 'ultraviolet',
  },
  dark: {
    document: 'gold',
    docsModeDocument: 'secondary',
    bookmarkhollow: 'seafoam',
    component: 'secondary',
    folder: 'primary',
  },
};
const isColor = (theme: Theme, color: string): color is keyof Color => color in theme.color;
const TypeIcon = styled(Icons)<{ docsMode?: boolean }>(
  {
    width: 14,
    height: 14,
    flex: '0 0 auto',
  },

  // @ts-expect-error (TODO)
  ({ theme, icon, symbol = icon, docsMode }) => {
    const colors = theme.base === 'dark' ? iconColors.dark : iconColors.light;
    const colorKey = docsMode && symbol === 'document' ? 'docsModeDocument' : symbol;
    const color = colors[colorKey as keyof typeof colors];
    return { color: isColor(theme, color) ? theme.color[color] : color };
  }
);

const BranchNode = styled.button<{
  depth?: number;
  isExpandable?: boolean;
  isExpanded?: boolean;
  isComponent?: boolean;
  isSelected?: boolean;
}>(({ theme, depth = 0, isExpandable = false }) => ({
  width: '100%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'start',
  textAlign: 'left',
  paddingLeft: `${(isExpandable ? 8 : 22) + depth * 18}px`,
  color: 'inherit',
  fontSize: `${theme.typography.size.s2}px`,
  background: 'transparent',
  minHeight: 28,
  borderRadius: 4,
  gap: 6,
  paddingTop: 5,
  paddingBottom: 4,

  '&:hover, &:focus': {
    background: transparentize(0.93, theme.color.secondary),
    outline: 'none',
  },
}));

const LeafNode = styled.a<{ depth?: number }>(({ theme, depth = 0 }) => ({
  cursor: 'pointer',
  color: 'inherit',
  display: 'flex',
  gap: 6,
  flex: 1,
  alignItems: 'start',
  paddingLeft: `${22 + depth * 18}px`,
  paddingTop: 5,
  paddingBottom: 4,
  fontSize: `${theme.typography.size.s2}px`,
  textDecoration: 'none',
}));

export const Path = styled.span(({ theme }) => ({
  display: 'grid',
  justifyContent: 'start',
  gridAutoColumns: 'auto',
  gridAutoFlow: 'column',
  color: theme.textMutedColor,
  fontSize: `${theme.typography.size.s1 - 1}px`,
  '& > span': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& > span + span': {
    position: 'relative',
    marginLeft: 4,
    paddingLeft: 7,
    '&:before': {
      content: "'/'",
      position: 'absolute',
      left: 0,
    },
  },
}));

export const RootNode = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 16,
  marginBottom: 4,
  fontSize: `${theme.typography.size.s1 - 1}px`,
  fontWeight: theme.typography.weight.bold,
  lineHeight: '16px',
  minHeight: 28,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: theme.textMutedColor,
}));

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 2,
});

export const GroupNode: FC<
  ComponentProps<typeof BranchNode> & { isExpanded?: boolean; isExpandable?: boolean }
> = React.memo(function GroupNode({
  children,
  isExpanded = false,
  isExpandable = false,
  ...props
}) {
  return (
    <BranchNode isExpandable={isExpandable} tabIndex={-1} {...props}>
      <Wrapper>
        {isExpandable && <CollapseIcon isExpanded={isExpanded} />}
        <TypeIcon icon="folder" useSymbol color="primary" />
      </Wrapper>
      {children}
    </BranchNode>
  );
});

export const ComponentNode: FC<ComponentProps<typeof BranchNode>> = React.memo(
  function ComponentNode({ theme, children, isExpanded, isExpandable, isSelected, ...props }) {
    return (
      <BranchNode isExpandable={isExpandable} tabIndex={-1} {...props}>
        <Wrapper>
          {isExpandable && <CollapseIcon isExpanded={isExpanded} />}
          <TypeIcon icon="component" useSymbol color="secondary" />
        </Wrapper>
        {children}
      </BranchNode>
    );
  }
);

export const DocumentNode: FC<ComponentProps<typeof LeafNode> & { docsMode: boolean }> = React.memo(
  function DocumentNode({ theme, children, docsMode, ...props }) {
    return (
      <LeafNode tabIndex={-1} {...props}>
        <Wrapper>
          <TypeIcon icon="document" useSymbol docsMode={docsMode} />
        </Wrapper>
        {children}
      </LeafNode>
    );
  }
);

export const StoryNode: FC<ComponentProps<typeof LeafNode>> = React.memo(function StoryNode({
  theme,
  children,
  ...props
}) {
  return (
    <LeafNode tabIndex={-1} {...props}>
      <Wrapper>
        <TypeIcon icon="bookmarkhollow" useSymbol />
      </Wrapper>
      {children}
    </LeafNode>
  );
});
