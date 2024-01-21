import React from 'react';
import { Icons, type IconsProps } from '@storybook/core/dist/modules/components/index';
import { type Call, CallStates } from '@storybook/core/dist/modules/instrumenter/index';
import { styled } from '@storybook/core/dist/modules/theming/index';

import { transparentize } from 'polished';
import localTheme from '../theme';

export interface StatusIconProps {
  status: Call['status'];
  useSymbol?: IconsProps['useSymbol'];
  className?: string;
}

const {
  colors: {
    pure: { gray },
  },
} = localTheme;

const StyledStatusIcon = styled(Icons)<StatusIconProps>(({ theme, status }) => {
  const color = {
    [CallStates.DONE]: theme.color.positive,
    [CallStates.ERROR]: theme.color.negative,
    [CallStates.ACTIVE]: theme.color.secondary,
    [CallStates.WAITING]: transparentize(0.5, gray[500]),
  }[status];
  return {
    width: status === CallStates.WAITING ? 6 : 12,
    height: status === CallStates.WAITING ? 6 : 12,
    color,
    justifySelf: 'center',
  };
});

export const StatusIcon: React.FC<StatusIconProps> = ({ status, className }) => {
  const icon = {
    [CallStates.DONE]: 'check',
    [CallStates.ERROR]: 'stopalt',
    [CallStates.ACTIVE]: 'play',
    [CallStates.WAITING]: 'circle',
  }[status] as IconsProps['icon'];
  return (
    <StyledStatusIcon
      data-testid={`icon-${status}`}
      status={status}
      icon={icon}
      className={className}
    />
  );
};
