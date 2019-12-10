import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { IconButton } from '../../bar/button';
import { Icons } from '../../icon/icon';

const ExpanderButton = styled(IconButton)<{}>(() => ({
  marginRight: 6,
  height: 'auto',
  border: 'none',
}));

export interface CollapsibleRowProps {
  section: string;
  expanded: boolean;
  children: (isExpanded: boolean) => React.ReactNode;
  numRows: number;
}

const NameTh = styled.th<{}>(() => ({
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
}));

const Th = styled.th<{}>(() => ({
  fontWeight: 'normal',
}));

export const CollapsibleRow: FC<CollapsibleRowProps> = ({
  section,
  expanded,
  numRows,
  children,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  return (
    <>
      <tr>
        <NameTh colSpan={1}>
          <ExpanderButton
            onClick={expanded === undefined ? undefined : () => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Icons icon="arrowdown" /> : <Icons icon="arrowright" />}
          </ExpanderButton>
          {section}
        </NameTh>
        <Th colSpan={2}>{!isExpanded && `${numRows} prop${numRows !== 1 ? 's' : ''}`}</Th>
      </tr>
      {children(isExpanded)}
    </>
  );
};
