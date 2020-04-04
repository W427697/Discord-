import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import HighlightToggle from './HighlightToggle';

function ThemedHighlightToggle(props) {
  return (
    <ThemeProvider theme={convert(themes.normal)}>
      <HighlightToggle {...props} />
    </ThemeProvider>
  );
}

describe('HighlightToggle component', () => {
  test('should render', () => {
    // given
    const wrapper = mount(<ThemedHighlightToggle />);

    // then
    expect(wrapper.exists()).toBe(true);
  });

  test('should match snapshot', () => {
    // given
    const wrapper = mount(<ThemedHighlightToggle />);

    // then
    expect(wrapper).toMatchSnapshot();
  });
});
