import { Bar as BaseBar, IconButton, TooltipNote, WithTooltip } from '@storybook/components';
import { AddIcon, BookmarkHollowIcon, InfoIcon, UndoIcon } from '@storybook/icons';
import { styled } from '@storybook/theming';
import React from 'react';

const Bar = styled(BaseBar)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
  padding: '6px 10px',
  fontSize: theme.typography.size.s2,
  containerType: 'size',
  background: theme.background.bar,
  borderTop: `1px solid ${theme.color.border}`,
  overflow: 'visible',
}));

const Content = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 10,
  gap: 6,

  'span:last-of-type': {
    display: 'none',
  },
  '@container (min-width: 800px)': {
    'span:first-of-type': {
      display: 'none',
    },
    'span:last-of-type': {
      display: 'inline',
    },
  },
});

const Actions = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  color: theme.color.mediumdark,
  fontSize: theme.typography.size.s2,
}));

const ActionButton = styled(IconButton)({
  span: {
    display: 'none',
    '@container (min-width: 800px)': {
      display: 'inline',
    },
  },
});

type SaveFromControlsProps = {
  saveStory: () => void;
  createStory: () => void;
  resetArgs: () => void;
};

export const SaveFromControls = ({ saveStory, createStory, resetArgs }: SaveFromControlsProps) => {
  return (
    <Bar>
      <Content>
        <InfoIcon />
        <span>Unsaved changes</span>
        <span>You modified this story. Do you want to save your changes?</span>
      </Content>

      <Actions>
        <WithTooltip
          as="div"
          hasChrome={false}
          trigger="hover"
          tooltip={<TooltipNote note="Save changes to story" />}
        >
          <ActionButton aria-label="Save changes to story" onClick={() => saveStory()}>
            <BookmarkHollowIcon />
            Save
          </ActionButton>
        </WithTooltip>

        <WithTooltip
          as="div"
          hasChrome={false}
          trigger="hover"
          tooltip={<TooltipNote note="Create new story with these settings" />}
        >
          <ActionButton
            aria-label="Create new story with these settings"
            onClick={() => createStory()}
          >
            <AddIcon />
            <span>Create new story</span>
          </ActionButton>
        </WithTooltip>

        <WithTooltip
          as="div"
          hasChrome={false}
          trigger="hover"
          tooltip={<TooltipNote note="Reset changes" />}
        >
          <ActionButton aria-label="Reset changes" onClick={() => resetArgs()}>
            <UndoIcon />
            <span>Reset</span>
          </ActionButton>
        </WithTooltip>
      </Actions>
    </Bar>
  );
};
