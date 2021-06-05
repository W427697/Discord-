import React from 'react';
import { SizeMe } from 'react-sizeme';
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
    <SizeMe refreshMode="debounce">
      {({ size }) => {
        const narrowView = (size.width || 0) < maxWidthBeforeBreak;
        return (
          <Item narrowView={narrowView}>
            <StyledBadge status={badgeType}>{formatSeverityText(rule.impact)}</StyledBadge>
            <Message narrowView={narrowView}>{rule.message}</Message>
          </Item>
        );
      }}
    </SizeMe>
  );
};

const maxWidthBeforeBreak = 350;

interface ItemProps {
  narrowView: boolean;
}

const Item = styled.div<ItemProps>(({ narrowView }) => ({
  display: 'flex',
  flexDirection: narrowView ? 'column-reverse' : 'row',
  marginBottom: 12,
  '&:last-of-type': {
    marginBottom: 0,
  },
}));

const StyledBadge = styled(Badge)({
  minWidth: 65,
  maxWidth: 'fit-content',
  marginRight: 8,
  width: '100%',
  textAlign: 'center',
  alignSelf: 'flex-start',
});

interface MessageProps {
  narrowView: boolean;
}

const Message = styled.div<MessageProps>(({ narrowView }) => ({
  fontSize: 13,
  paddingTop: 2,
  marginBottom: narrowView ? 6 : 0,
}));
