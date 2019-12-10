import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { IconButton } from '../../bar/button';
import { Icons } from '../../icon/icon';

const ExpanderButton = styled(IconButton)<{}>(() => ({
  marginRight: 6,
  height: 'auto',
  border: 'none',
}));

export interface SectionRowProps {
  section: string;
  expanded?: boolean;
}

const NameTh = styled.th<{}>(() => ({
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
}));

const Th = styled.th<{}>(() => ({
  fontWeight: 'normal',
}));

export const CollapsibleRow: FC<SectionRowProps> = ({ section, expanded, children }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded);
  return (
    <>
      <tr>
        <NameTh>
          <ExpanderButton
            onClick={expanded === undefined ? undefined : () => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Icons icon="arrowdown" /> : <Icons icon="arrowright" />}
          </ExpanderButton>
          {section}
        </NameTh>
        {!expanded && Array.isArray(children) && (
          <Th>{`${children.length} prop${children.length !== 1 ? 's' : ''}`}</Th>
        )}
      </tr>
      {isExpanded && children}
    </>
  );
};
