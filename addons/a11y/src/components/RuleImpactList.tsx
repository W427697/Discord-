import React, { useRef } from 'react';
import { uniqueId } from 'lodash';
import { styled } from '@storybook/theming';
import { ImpactBadge } from './ImpactBadge';
import { ADDON_ID } from '../constants';

/* eslint-disable import/order */
import type { CheckResult } from 'axe-core';

interface RuleImpactListProps {
  rules: CheckResult[];
}

export const RuleImpactList = ({ rules }: RuleImpactListProps) => {
  const id = `${ADDON_ID}-report-rule-list`;
  const keyRef = useRef(uniqueId(id));

  return (
    <div>
      {rules.map((rule, index) => {
        const key = `${keyRef.current}-${index}`;
        return (
          <Rule key={key}>
            <ImpactBadge impact={rule.impact} />
            <Message>{rule.message}</Message>
          </Rule>
        );
      })}
    </div>
  );
};

const Rule = styled.div({
  display: 'flex',
  marginBottom: 16,
  '&:last-of-type': {
    marginBottom: 0,
  },
});

const Message = styled.div({
  fontSize: 13,
  paddingTop: 1,
  marginLeft: 16,
});
