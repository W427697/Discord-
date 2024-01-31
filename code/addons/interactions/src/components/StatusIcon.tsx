import React from 'react';
import { type Call, CallStates } from '@storybook/instrumenter';
import { styled, useTheme } from '@storybook/theming';

import { transparentize } from 'polished';
import { CheckIcon, CircleIcon, PlayIcon, StopAltIcon } from '@storybook/icons';

export interface StatusIconProps {
  status: Call['status'];
}

const WarningContainer = styled.div({
  width: 14,
  height: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StatusIcon: React.FC<StatusIconProps> = ({ status }) => {
  const theme = useTheme();

  return (
    <>
      {status === CallStates.DONE && <CheckIcon color={theme.color.positive} />}
      {status === CallStates.ERROR && <StopAltIcon color={theme.color.negative} />}
      {status === CallStates.ACTIVE && <PlayIcon color={theme.color.secondary} />}
      {status === CallStates.WAITING && (
        <WarningContainer>
          <CircleIcon color={transparentize(0.5, '#CCCCCC')} size={6} />
        </WarningContainer>
      )}
    </>
  );
};
