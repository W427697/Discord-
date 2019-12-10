import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { PropDef } from './PropDef';
import { PropRows } from './PropRows';
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
  rows: PropDef[];
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

export const CollapsibleRow: FC<CollapsibleRowProps> = ({ section, expanded, numRows, rows }) => {
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
      {isExpanded && <PropRows section={section} rows={rows} />}
    </>
  );
};
