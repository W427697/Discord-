import React from 'react';
import { styled } from '@storybook/theming';
import { Badge } from '@storybook/components';

import type { CheckResult } from 'axe-core';

const formatSeverityText = (severity: string) => {
  return severity.charAt(0).toUpperCase().concat(severity.slice(1));
};

export enum ImpactValue {
  MINOR = 'minor',
  MODERATE = 'moderate',
  SERIOUS = 'serious',
  CRITICAL = 'critical',
}

interface ReportRuleItemProps {
  rule: CheckResult;
}

export const ReportRuleItem = ({ rule }: ReportRuleItemProps) => {
  let badgeType: any = null;
  switch (rule.impact) {
    case ImpactValue.CRITICAL:
      badgeType = 'critical';
      break;
    case ImpactValue.SERIOUS:
      badgeType = 'negative';
      break;
    case ImpactValue.MODERATE:
      badgeType = 'warning';
      break;
    case ImpactValue.MINOR:
      badgeType = 'neutral';
      break;
    default:
      break;
  }
  return (
    <Item>
      <StyledBadge status={badgeType}>{formatSeverityText(rule.impact)}</StyledBadge>
      <Message>{rule.message}</Message>
    </Item>
  );
};

const Item = styled.div({
  display: 'flex',
  marginBottom: 12,
  '&:last-of-type': {
    marginBottom: 0,
  },
});

const StyledBadge = styled(Badge)({
  minWidth: 65,
  maxWidth: 'fit-content',
  marginRight: 8,
  width: '100%',
  textAlign: 'center',
  alignSelf: 'flex-start',
});

const Message = styled.div({
  fontSize: 13,
  paddingTop: 1,
});
