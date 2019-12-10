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
}

const NameTh = styled.th<{}>(() => ({
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
}));

const Th = styled.th<{}>(() => ({
  fontWeight: 'normal',
}));

export const CollapsibleRow: FC<CollapsibleRowProps> = ({ section, expanded, children }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  return (
    <>
      <tr>
        <NameTh colSpan={isExpanded ? 1 : 3}>
          <ExpanderButton
            onClick={expanded === undefined ? undefined : () => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Icons icon="arrowdown" /> : <Icons icon="arrowright" />}
          </ExpanderButton>
          {section}
        </NameTh>
        {!isExpanded && Array.isArray(children) && (
          <Th colSpan={2}>{`${children.length} prop${children.length !== 1 ? 's' : ''}`}</Th>
        )}
      </tr>
      {isExpanded && children}
    </>
  );
};
