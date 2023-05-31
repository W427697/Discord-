import React from 'react';
import { styled } from '@storybook/theming';

import { Icons } from '../icon/icon';

const ListItemWrapper = styled.li(() => ({
  display: 'flex',
  alignItems: 'center',
  columnGap: 12,
}));
const ListItemContentWrapper = styled.div(() => ({}));
const ListItemIndexWrapper = styled.div<{ isCompleted: boolean }>(({ isCompleted }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: !isCompleted && '1px solid #ccc',
  minWidth: 40,
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: isCompleted ? 'green' : 'white',
}));

interface ListItemProps {
  children: React.ReactNode;
  nthItem: number;
  isCompleted?: boolean;
}

export function ListItem({ children, nthItem, isCompleted }: ListItemProps) {
  return (
    <ListItemWrapper aria-label={isCompleted ? 'complete' : 'not complete'}>
      <ListItemIndexWrapper isCompleted={isCompleted}>
        {isCompleted ? <Icons icon="check" color="white" /> : nthItem}
      </ListItemIndexWrapper>
      <ListItemContentWrapper>{children}</ListItemContentWrapper>
    </ListItemWrapper>
  );
}

ListItem.displayName = 'ListItem';
