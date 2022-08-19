import { codeCommon } from '@storybook/components';
import { styled } from '@storybook/theming';
import Markdown from 'markdown-to-jsx';
import { transparentize } from 'polished';
import React, { FC } from 'react';
import { ArgControl, ArgControlProps } from './ArgControl';
import { ArgJsDoc } from './ArgJsDoc';
import { ArgValue } from './ArgValue';
import { Args, ArgType, HidableColumn, TableAnnotation } from './types';

interface ArgRowProps {
  row: ArgType;
  arg: any;
  updateArgs?: (args: Args) => void;
  compact?: boolean;
  expandable?: boolean;
  initialExpandedArgs?: boolean;
  hideColumns: HidableColumn[];
}

const Name = styled.span({ fontWeight: 'bold' });

const Required = styled.span(({ theme }) => ({
  color: theme.color.negative,
  fontFamily: theme.typography.fonts.mono,
  cursor: 'help',
}));

const Description = styled.div(({ theme }) => ({
  '&&': {
    p: {
      margin: '0 0 10px 0',
    },
    a: {
      color: theme.color.secondary,
    },
  },

  code: {
    ...codeCommon({ theme }),
    fontSize: 12,
    fontFamily: theme.typography.fonts.mono,
  },

  '& code': {
    margin: 0,
    display: 'inline-block',
  },

  '& pre > code': {
    whiteSpace: 'pre-wrap',
  },
}));

const Type = styled.div<{ hasDescription: boolean }>(({ theme, hasDescription }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.1, theme.color.defaultText)
      : transparentize(0.2, theme.color.defaultText),
  marginTop: hasDescription ? 4 : 0,
}));

const TypeWithJsDoc = styled.div<{ hasDescription: boolean }>(({ theme, hasDescription }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.1, theme.color.defaultText)
      : transparentize(0.2, theme.color.defaultText),
  marginTop: hasDescription ? 12 : 0,
  marginBottom: 12,
}));

const StyledTd = styled.td<{ expandable: boolean }>(({ theme, expandable }) => ({
  paddingLeft: expandable ? '40px !important' : '20px !important',
}));

export const ArgRow: FC<ArgRowProps> = (props) => {
  const { row, updateArgs, compact, expandable, initialExpandedArgs, hideColumns } = props;
  const { name, description } = row;
  const table = (row.table || {}) as TableAnnotation;
  const type = table.type || row.type;
  const defaultValue = table.defaultValue || row.defaultValue;
  const required = row.type?.required;
  const hasDescription = description != null && description !== '';

  return (
    <tr>
      <StyledTd expandable={expandable}>
        <Name>{name}</Name>
        {required ? <Required title="Required">*</Required> : null}
      </StyledTd>
      {compact || hideColumns?.includes('description') ? null : (
        <td>
          {hasDescription && (
            <Description>
              <Markdown>{description}</Markdown>
            </Description>
          )}
          {table.jsDocTags != null ? (
            <>
              <TypeWithJsDoc hasDescription={hasDescription}>
                <ArgValue value={type} initialExpandedArgs={initialExpandedArgs} />
              </TypeWithJsDoc>
              <ArgJsDoc tags={table.jsDocTags} />
            </>
          ) : (
            <Type hasDescription={hasDescription}>
              <ArgValue value={type} initialExpandedArgs={initialExpandedArgs} />
            </Type>
          )}
        </td>
      )}
      {compact || hideColumns?.includes('default') ? null : (
        <td>
          <ArgValue value={defaultValue} initialExpandedArgs={initialExpandedArgs} />
        </td>
      )}
      {updateArgs && !hideColumns?.includes('control') ? (
        <td>
          <ArgControl {...(props as ArgControlProps)} />
        </td>
      ) : null}
    </tr>
  );
};
