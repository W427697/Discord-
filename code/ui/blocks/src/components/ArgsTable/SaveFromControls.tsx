import { Bar as BaseBar, IconButton, TooltipNote, WithTooltip, Form } from '@storybook/components';
import { AddIcon, CheckIcon, UndoIcon } from '@storybook/icons';
import { keyframes, styled } from '@storybook/theming';
import React from 'react';

const slideIn = keyframes({
  from: { transform: 'translateY(40px)' },
  to: { transform: 'translateY(0)' },
});

const Container = styled.div({
  containerType: 'size',
  position: 'sticky',
  bottom: 0,
  height: 39,
  overflow: 'hidden',
});

const Bar = styled(BaseBar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 6,
  padding: '6px 10px',
  animation: `${slideIn} 300ms forwards`,
  background: theme.background.bar,
  borderTop: `1px solid ${theme.appBorderColor}`,
  fontSize: theme.typography.size.s2,
}));

const Content = styled.div({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 10,
  gap: 6,
});

const Label = styled.div({
  '@container (max-width: 799px)': {
    lineHeight: 0,
    textIndent: '-9999px',
    '&::after': {
      content: 'attr(data-short-label)',
      display: 'block',
      lineHeight: 'initial',
      textIndent: '0',
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
    <Container>
      <Bar>
        <Content>
          <Label data-short-label="Unsaved changes">
            You modified this story. Do you want to save your changes?
          </Label>
        </Content>

        {creating ? (
          <InlineForm onSubmit={onSubmitForm}>
            <InlineInput
              onChange={onChange}
              placeholder="NewStoryName"
              ref={inputRef}
              value={storyName}
            />
            <IconButton
              aria-label="Save story to file system"
              disabled={saving || !storyName}
              type="submit"
            >
              Save
            </IconButton>
            <IconButton onClick={onCancelForm} disabled={saving} type="reset">
              Cancel
            </IconButton>
          </InlineForm>
        ) : (
          <Actions>
            <WithTooltip
              as="div"
              hasChrome={false}
              trigger="hover"
              tooltip={<TooltipNote note="Save changes to story" />}
            >
              <IconButton
                aria-label="Save changes to story"
                disabled={saving}
                onClick={onSaveStory}
              >
                <CheckIcon />
                <Label data-short-label="Save">Update story</Label>
              </IconButton>
            </WithTooltip>

            <WithTooltip
              as="div"
              hasChrome={false}
              trigger="hover"
              tooltip={<TooltipNote note="Create new story with these settings" />}
            >
              <IconButton aria-label="Create new story with these settings" onClick={onShowForm}>
                <AddIcon />
                <Label data-short-label="New">Create new story</Label>
              </IconButton>
            </WithTooltip>

            <WithTooltip
              as="div"
              hasChrome={false}
              trigger="hover"
              tooltip={<TooltipNote note="Reset changes" />}
            >
              <IconButton aria-label="Reset changes" onClick={() => resetArgs()}>
                <UndoIcon />
                <span>Reset</span>
              </IconButton>
            </WithTooltip>
          </Actions>
        )}
      </Bar>
    </Container>
  );
};
