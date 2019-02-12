import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { withState } from 'recompose';
import { opacify } from 'polished';

import { Icons } from '@storybook/components';

const FilterField = styled.input(({ theme }) => ({
  // resets
  appearance: 'none',
  border: 'none',
  boxSizing: 'inherit',
  display: ' block',
  outline: 'none',
  width: ' 100%',
  margin: ' 0',
  background: 'transparent',
  padding: 0,
  fontSize: 'inherit',

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
  top: '50%',
  transform: 'translateY(-50%)',
  right: 2,

  '> svg': {
    display: 'block',
    height: 8,
    width: 8,
    color: theme.input.color,
    transition: 'all 150ms ease-out',
  },

  '&:hover': {
    background: opacify(0.1, theme.appBorderColor),
  },
}));
const FilterForm = styled.form(({ theme, focused }) => ({
  borderBottom: focused ? `1px solid transparent` : '1px solid transparent',
  borderBottomColor: focused ? theme.color.secondary : theme.mainBorderColor,
  outline: 0,
  position: 'relative',

  input: {
    color: theme.input.color,
    fontSize: theme.typography.size.s2 - 1,
    lineHeight: '20px',
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '20px',
  },

  '> svg': {
    transition: 'all 150ms ease-out',
    position: 'absolute',
    top: '50%',
    height: '12px',
    width: '12px',
    transform: 'translateY(-50%)',
    zIndex: '1',

    background: 'transparent',

    path: {
      transition: 'all 150ms ease-out',
      fill: 'currentColor',
      opacity: focussed ? 1 : 0.3,
    },
  },
}));

const isSearchShortcut = (item) => item.title === 'Search';
const getPlaceholderText = (shortcuts) => shortcuts.find(isSearchShortcut)
export const PureSidebarSearch = ({ focused, onSetFocused, menu, ...props }) => {
const placeholder = getPlaceholderText(menu).detail
  return (
    <FilterForm autoComplete="off" focused={focused}>
      <FilterField
        autocomplete="off"
        id="storybook-explorer-searchfield"
        onFocus={() => onSetFocused(true)}
        onBlur={() => onSetFocused(false)}
        {...props}
        placeholder={focused ? 'Type to search...' : `Press "${placeholder}" to search...`}
      />
    </FilterForm>
  )
};

PureSidebarSearch.propTypes = {
  focused: PropTypes.bool.isRequired,
  onSetFocused: PropTypes.func.isRequired,
  menu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default withState('focused', 'onSetFocused', false)(PureSidebarSearch);
