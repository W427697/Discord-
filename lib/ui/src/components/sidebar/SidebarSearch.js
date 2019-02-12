import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { withState } from 'recompose';

const FilterField = styled.input(({ theme }) => ({
  height: 30,
  boxSizing: 'border-box',
  width: '100%',
  background: 'transparent',
  border: '0 none',
  color: theme.mainTextColor,
  padding: theme.layoutMargin,
  paddingLeft: 0,
  outline: 0,
}));
const FilterForm = styled.form(({ theme, focused }) => ({
  borderBottom: focused ? `1px solid transparent` : '1px solid transparent',
  borderBottomColor: focused ? theme.color.secondary : theme.mainBorderColor,
  outline: 0,
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
