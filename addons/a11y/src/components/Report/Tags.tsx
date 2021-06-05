import React, { FunctionComponent } from 'react';

import { css, styled } from '@storybook/theming';
import { TagValue } from 'axe-core';

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Item = styled.div`
  padding: 10px 12px;
  margin: 0 6px 6px 0;

  ${({ theme }) => css`
    border: 1px solid ${theme.appBorderColor};
    border-radius: ${theme.appBorderRadius}px;
    background-color: ${theme.background.content};
  `}
`;

type TagsProps = {
  tags: TagValue[];
} & React.HTMLAttributes<HTMLDivElement>;

export const Tags: FunctionComponent<TagsProps> = ({ tags, ...rest }) => {
  return (
    <Wrapper {...rest}>
      {tags.map((tag) => (
        <Item key={tag}>{tag}</Item>
      ))}
    </Wrapper>
  );
};
