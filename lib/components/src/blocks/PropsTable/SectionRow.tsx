import React, { FC } from 'react';
import { transparentize } from 'polished';
import { styled } from '@storybook/theming';
import { IconButton } from '../../bar/button';
import { Icons } from '../../icon/icon';

const ExpanderButton = styled(IconButton)<{}>(() => ({
  marginRight: 6,
  height: 'auto',
  border: 'none',
}));

const SectionFlexContainer = styled.div<{}>(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export interface SectionRowProps {
  section: string;
  expanded?: boolean;
}

const SectionTh = styled.th<{ expandable?: boolean }>(({ theme, expandable }) => ({
  letterSpacing: '0.35em',
  textTransform: expandable ? 'unset' : 'uppercase',
  fontWeight: theme.typography.weight.black,
  fontSize: theme.typography.size.s1 - 1,
  lineHeight: '24px',
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  background: `${theme.background.app} !important`,
}));

export const SectionRow: FC<SectionRowProps> = ({ section, expanded, children }) => {
  const [isExpanded, setIsExpanded] = React.useState(expanded !== undefined ? expanded : true);
  const expandable = expanded !== undefined;
  return (
    <>
      <tr>
        <SectionTh colSpan={3} expandable={expandable}>
          {expandable ? (
            <SectionFlexContainer>
              <ExpanderButton
                onClick={expanded === undefined ? undefined : () => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Icons icon="arrowdown" /> : <Icons icon="arrowright" />}
              </ExpanderButton>
              {section}
            </SectionFlexContainer>
          ) : (
            section
          )}
        </SectionTh>
      </tr>
      {(!expandable || isExpanded) && children}
    </>
  );
};
