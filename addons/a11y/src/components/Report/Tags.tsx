import React, { FunctionComponent } from 'react';

import { css, styled } from '@storybook/theming';
import { TagValue } from 'axe-core';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 12px 0;
`;

const Item = styled.div`
  padding: 5px;
  margin: 0 6px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }

  ${({ theme }) => css`
    border: 1px solid ${theme.appBorderColor};
    border-radius: ${theme.appBorderRadius}px;
    background-color: ${theme.background.content};
  `}
`;

interface TagsProps {
  tags: TagValue[];
}

export const Tags: FunctionComponent<TagsProps> = ({ tags }) => {
  return (
    <Wrapper>
      {tags.map((tag) => (
        <Item key={tag}>{tag}</Item>
      ))}
    </Wrapper>
  );
};
