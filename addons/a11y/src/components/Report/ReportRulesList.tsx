import React, { useRef } from 'react';
import { CheckResult } from 'axe-core';
import { uniqueId } from 'lodash';
import { styled } from '@storybook/theming';
import { ReportRuleItem } from './ReportRuleItem';
import { ADDON_ID } from '../../constants';

interface ReportRuleListProps {
  rules: CheckResult[];
}

export const ReportRuleList = ({ rules }: ReportRuleListProps) => {
  const id = `${ADDON_ID}-report-rule-list`;
  const keyRef = useRef(uniqueId(id));

  return (
    <Wrapper>
      {rules.map((rule, index) => {
        const key = `${keyRef.current}-${index}`;
        return <ReportRuleItem rule={rule} key={key} />;
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  fontWeight: '400',
} as any);
