import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { withState } from 'recompose';
import { opacify } from 'polished';

import { Icons } from '@storybook/components';

const FilterField = styled.input(({ theme }) => ({
  // resets
  appearance: 'none',
  background: 'transparent',
  border: 'none',
  boxSizing: 'inherit',
  display: ' block',
  fontSize: 'inherit',
  margin: ' 0',
  outline: 'none',
  padding: 0,
  width: ' 100%',

  '&:-webkit-autofill': { WebkitBoxShadow: `0 0 0 3em ${theme.color.lightest} inset` },

  '::placeholder': {
    color: theme.color.mediumdark,
  },

  '&:placeholder-shown ~ button': {
    // hide cancel button using CSS only
    opacity: 0,
  },
}));

const CancelButton = styled.button(({ theme }) => ({
  border: 0,
  margin: 0,
  padding: 4,
  textDecoration: 'none',

  background: theme.appBorderColor,
  borderRadius: '1em',
  cursor: 'pointer',
  opacity: 1,
  transition: 'all 150ms ease-out',

  position: 'absolute',
  right: 2,
  top: '50%',
  transform: 'translateY(-50%)',

  '> svg': {
    color: theme.input.color,
    display: 'block',
    height: 8,
    transition: 'all 150ms ease-out',
    width: 8,
  },

  '&:hover': {
    background: opacify(0.1, theme.appBorderColor),
  },
}));

const FilterForm = styled.form(({ theme, focussed }) => ({
  borderBottom: '1px solid transparent',
  borderBottomColor: focussed
    ? opacify(0.3, theme.appBorderColor)
    : opacify(0.1, theme.appBorderColor),
  outline: 0,
  position: 'relative',
  transition: 'all 150ms ease-out',

  input: {
    color: theme.input.color,
    fontSize: theme.typography.size.s2 - 1,
    lineHeight: '20px',
    paddingBottom: '2px',
    paddingLeft: '20px',
    paddingTop: '2px',
  },

  '> svg': {
    background: 'transparent',
    height: '12px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    transition: 'all 150ms ease-out',
    width: '12px',
    zIndex: '1',

    path: {
      fill: 'currentColor',
      opacity: focussed ? 1 : 0.3,
      transition: 'all 150ms ease-out',
    },
  },
}));

const isSearchShortcut = item => item.title === 'Search';
const getPlaceholderText = shortcuts => shortcuts.find(isSearchShortcut);

export const PureSidebarSearch = ({
  focussed,
  onSetFocussed,
  className,
  menu,
  onChange,
  ...props
}) => {
  const placeholder = getPlaceholderText(menu).detail;
  return (
    <FilterForm
      autoComplete="off"
      focused={focussed}
      className={className}
      onReset={() => onChange('')}
    >
      <FilterField
        type="text"
        autocomplete="off"
        id="storybook-explorer-searchfield"
        onFocus={() => onSetFocussed(true)}
        onBlur={() => onSetFocussed(false)}
        onChange={e => onChange(e.target.value)}
        {...props}
        placeholder={focussed ? 'Type to search...' : `Press "${placeholder}" to search...`}
      />
      <Icons icon="search" />
      <CancelButton type="reset" value="reset">
        <Icons icon="closeAlt" />
      </CancelButton>
    </FilterForm>
  );
};

PureSidebarSearch.propTypes = {
  className: PropTypes.string,
  focussed: PropTypes.bool.isRequired,
  menu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onChange: PropTypes.func.isRequired,
  onSetFocussed: PropTypes.func.isRequired,
};

PureSidebarSearch.defaultProps = {
  className: null,
};

export default withState('focussed', 'onSetFocussed', false, 'menu')(PureSidebarSearch);
