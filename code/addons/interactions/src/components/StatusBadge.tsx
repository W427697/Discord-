import React from 'react';
import { Call, CallStates } from '@storybook/instrumenter';
import { styled, typography } from '@storybook/theming';

export interface StatusBadgeProps {
  status: Call['status'];
}

const StyledBadge = styled.div<StatusBadgeProps>(({ theme, status }) => {
  const backgroundColor = {
    [CallStates.DONE]: theme.color.green,
    [CallStates.ERROR]: theme.background.critical,
    [CallStates.ACTIVE]: theme.color.gold,
    [CallStates.WAITING]: theme.color.gold,
  }[status];
  return {
    padding: '4px 6px 4px 8px;',
    borderRadius: '4px',
    backgroundColor,
    color: 'white',
    fontFamily: typography.fonts.base,
    textTransform: 'uppercase',
    fontSize: typography.size.s1,
    letterSpacing: 3,
    fontWeight: typography.weight.bold,
    width: 65,
    textAlign: 'center',
  };
});

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const badgeText = {
    [CallStates.DONE]: 'Pass',
    [CallStates.ERROR]: 'Fail',
    [CallStates.ACTIVE]: 'Runs',
    [CallStates.WAITING]: 'Runs',
  }[status];
  return <StyledBadge status={status}>{badgeText}</StyledBadge>;
};
