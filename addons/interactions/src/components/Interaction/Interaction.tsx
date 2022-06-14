import * as React from 'react';
import { Call, CallStates, ControlStates } from '@storybook/instrumenter';
import { styled, typography } from '@storybook/theming';
import { transparentize } from 'polished';

import { MatcherResult } from '../MatcherResult';
import { MethodCall } from '../MethodCall';
import { StatusIcon } from '../StatusIcon/StatusIcon';
import { Controls } from '../../Panel';

const MethodCallWrapper = styled.div(() => ({
  fontFamily: typography.fonts.mono,
  fontSize: typography.size.s1,
  overflowWrap: 'break-word',
  inlineSize: 'calc( 100% - 40px )',
}));

const RowContainer = styled('div', {
  shouldForwardProp: (prop) => !['call', 'isNext'].includes(prop),
})<{ call: Call; isNext: boolean }>(
  ({ theme, call }) => ({
    display: 'flex',
    flexDirection: 'column',
    borderBottom: `1px solid ${theme.appBorderColor}`,
    fontFamily: typography.fonts.base,
    fontSize: 13,
    ...(call.status === CallStates.ERROR && {
      backgroundColor:
        theme.base === 'dark'
          ? transparentize(0.93, theme.color.negative)
          : theme.background.warning,
    }),
    paddingLeft: call.parentId ? 20 : 0,
  }),
  ({ theme, isNext }) =>
    isNext && {
      '&::before': {
        content: '""',
        boxShadow: `0 0 1px 1px ${theme.color.secondary}`,
      },
    }
);

const RowLabel = styled('button', { shouldForwardProp: (prop) => !['call'].includes(prop) })<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { call: Call }
>(({ theme, disabled, call }) => ({
  display: 'grid',
  background: 'none',
  border: 0,
  gridTemplateColumns: '15px 1fr',
  alignItems: 'center',
  minHeight: 40,
  margin: 0,
  padding: '8px 15px',
  textAlign: 'start',
  cursor: disabled || call.status === CallStates.ERROR ? 'default' : 'pointer',
  '&:hover': disabled ? {} : { background: theme.background.hoverable },
  '&:focus-visible': {
    outline: 0,
    boxShadow: `inset 3px 0 0 0 ${
      call.status === CallStates.ERROR ? theme.color.warning : theme.color.secondary
    }`,
    background: call.status === CallStates.ERROR ? 'transparent' : theme.background.hoverable,
  },
  '& > div': {
    opacity: call.status === CallStates.WAITING ? 0.5 : 1,
  },
}));

const RowMessage = styled('div')(({ theme }) => ({
  padding: '8px 10px 8px 36px',
  fontSize: typography.size.s1,
  pre: {
    margin: 0,
    padding: 0,
  },
  p: {
    color: theme.color.dark,
  },
}));

const Exception = ({ exception }: { exception: Call['exception'] }) => {
  if (exception.message.startsWith('expect(')) {
    return <MatcherResult {...exception} />;
  }
  const paragraphs = exception.message.split('\n\n');
  const more = paragraphs.length > 1;
  return (
    <RowMessage>
      <pre>{paragraphs[0]}</pre>
      {more && <p>See the full stack trace in the browser console.</p>}
    </RowMessage>
  );
};

export const Interaction = ({
  call,
  callsById,
  controls,
  controlStates,
  nextCallId,
}: {
  call: Call;
  callsById: Map<Call['id'], Call>;
  controls: Controls;
  controlStates: ControlStates;
  nextCallId: Call['id'];
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <RowContainer call={call} isNext={nextCallId === call.id}>
      <RowLabel
        call={call}
        onClick={() => controls.goto(call.id)}
        disabled={!controlStates.goto || !call.interceptable || !!call.parentId}
        onMouseEnter={() => controlStates.goto && setIsHovered(true)}
        onMouseLeave={() => controlStates.goto && setIsHovered(false)}
      >
        <StatusIcon status={isHovered ? CallStates.ACTIVE : call.status} />
        <MethodCallWrapper style={{ marginLeft: 6, marginBottom: 1 }}>
          <MethodCall call={call} callsById={callsById} />
        </MethodCallWrapper>
      </RowLabel>
      {call.status === CallStates.ERROR && call.exception?.callId === call.id && (
        <Exception exception={call.exception} />
      )}
    </RowContainer>
  );
};
