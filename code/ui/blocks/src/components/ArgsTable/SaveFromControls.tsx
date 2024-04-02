import { Bar as BaseBar, IconButton, TooltipNote, WithTooltip, Form } from '@storybook/components';
import { AddIcon, CheckIcon, UndoIcon } from '@storybook/icons';
import { styled } from '@storybook/theming';
import React from 'react';

const Bar = styled(BaseBar)(({ theme }) => ({
  position: 'sticky',
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 39,
  gap: 6,
  padding: '6px 10px',
  fontSize: theme.typography.size.s2,
  containerType: 'size',
  background: theme.background.bar,
  borderTop: `1px solid ${theme.appBorderColor}`,
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

const InlineForm = styled(Form)({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  width: 'auto',
});

const InlineInput = styled(Form.Input)(({ theme }) => ({
  height: 28,
  minHeight: 28,
  marginRight: 4,

  '::placeholder': {
    color: theme.color.mediumdark,
  },
  '&:invalid:not(:placeholder-shown)': {
    boxShadow: `${theme.color.negative} 0 0 0 1px inset`,
  },
}));

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
  createStory: (storyName: string) => void;
  resetArgs: () => void;
};

export const SaveFromControls = ({ saveStory, createStory, resetArgs }: SaveFromControlsProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [saving, setSaving] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [storyName, setStoryName] = React.useState('');

  const onSaveStory = () => {
    setSaving(true);
    saveStory();
    setTimeout(() => setSaving(false), 1000);
  };

  const onShowForm = () => {
    setCreating(true);
    setStoryName('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .replace(/[^a-z-_ ]/gi, '')
      .replaceAll(/([-_ ]+[a-z])/gi, (match) => match.toUpperCase().replace(/[-_ ]/g, ''));
    setStoryName(value.charAt(0).toUpperCase() + value.slice(1));
  };
  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    createStory(storyName.replaceAll(/[^a-z]/gi, ''));
    setTimeout(() => {
      setSaving(false);
      setCreating(false);
    }, 1000);
  };
  const onCancelForm = () => {
    setCreating(false);
  };

  return (
    <Bar>
      <Content>
        <span>Unsaved changes</span>
        <span>You modified this story. Do you want to save your changes?</span>
      </Content>

      {creating ? (
        <InlineForm onSubmit={onSubmitForm}>
          <InlineInput
            onChange={onChange}
            placeholder="NewStoryName"
            ref={inputRef}
            value={storyName}
          />
          <ActionButton
            aria-label="Save story to file system"
            disabled={saving || !storyName}
            type="submit"
          >
            Save
          </ActionButton>
          <ActionButton onClick={onCancelForm} disabled={saving} type="reset">
            Cancel
          </ActionButton>
        </InlineForm>
      ) : (
        <Actions>
          <WithTooltip
            as="div"
            hasChrome={false}
            trigger="hover"
            tooltip={<TooltipNote note="Save changes to story" />}
          >
            <ActionButton
              aria-label="Save changes to story"
              disabled={saving}
              onClick={onSaveStory}
            >
              <CheckIcon />
              Update story
            </ActionButton>
          </WithTooltip>

          <WithTooltip
            as="div"
            hasChrome={false}
            trigger="hover"
            tooltip={<TooltipNote note="Create new story with these settings" />}
          >
            <ActionButton aria-label="Create new story with these settings" onClick={onShowForm}>
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
      )}
    </Bar>
  );
};
