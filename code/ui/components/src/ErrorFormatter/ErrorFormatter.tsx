import { global } from '@storybook/global';
import type { FC } from 'react';
import React, { Fragment } from 'react';
import { styled } from '@storybook/theming';

const { document } = global;

const ErrorName = styled.strong(({ theme }) => ({
  color: theme.color.orange,
}));
const ErrorImportant = styled.strong(({ theme }) => ({
  color: theme.color.ancillary,
  textDecoration: 'underline',
}));
const ErrorDetail = styled.em(({ theme }) => ({
  color: theme.textMutedColor,
}));

const firstLineRegex = /(Error): (.*)\n/;
const linesRegex = /at (?:(.*) )?\(?(.+)\)?/;
export const ErrorFormatter: FC<{ error: Error }> = ({ error }) => {
  if (!error) {
    return <Fragment>This error has no stack or message</Fragment>;
  }
  if (!error.stack) {
    return <Fragment>{error.message || 'This error has no stack or message'}</Fragment>;
  }

  const input = error.stack.toString();
  const match = input.match(firstLineRegex);

  if (!match) {
    return <Fragment>{input}</Fragment>;
  }

  const [, type, name] = match;

  const rawLines = input.split(/\n/).slice(1);
  const [, ...lines] = rawLines
    .map((line) => {
      const r = line.match(linesRegex);

      return r ? { name: r[1], location: r[2].replace(document.location.origin, '') } : null;
    })
    .filter(Boolean);

  return (
    <Fragment>
      <span>{type}</span>: <ErrorName>{name}</ErrorName>
      <br />
      {lines.map((l, i) =>
        l.name ? (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            {'  '}at <ErrorImportant>{l.name}</ErrorImportant> (
            <ErrorDetail>{l.location}</ErrorDetail>)
            <br />
          </Fragment>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            {'  '}at <ErrorDetail>{l.location}</ErrorDetail>
            <br />
          </Fragment>
        )
      )}
    </Fragment>
  );
};
