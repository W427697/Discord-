import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import SelectType from '../types/Select';

import 'jest-dom/extend-expect';

function ThemedSelectType(props) {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <SelectType {...props} />
    </ThemeProvider>
  );
}

describe('Select', () => {
  afterEach(cleanup);

  describe('Object values', () => {
    it('correctly maps option keys and values', () => {
      const onChange = jest.fn();
      const knob = {
        name: 'Colors',
        value: '#00ff00',
        options: {
          Green: '#00ff00',
          Red: '#ff0000',
        },
        onChange,
      };
      const wrapper = render(ThemedSelectType({ knob }));

      expect(wrapper.getByTitle('Green')).toBeInTheDocument();
      expect(wrapper.getByTitle('Red')).toBeInTheDocument();
    });
  });

  describe('calls onChange callback', () => {
    it('calls ', async () => {
      const onChange = jest.fn();
      const knob = {
        name: 'Colors',
        value: '#00ff00',
        options: {
          Green: '#00ff00',
          Red: '#ff0000',
        },
        onChange,
      };

      const wrapper = render(ThemedSelectType({ knob, onChange }));

      fireEvent.change(wrapper.getByTitle(knob.name), { target: { value: 'Red' } });

      expect(onChange).toHaveBeenCalledWith('#ff0000');
    });
  });

  describe('Array values', () => {
    it('correctly maps option keys and values', () => {
      const onChange = jest.fn();
      const knob = {
        name: 'Colors',
        value: '#00ff00',
        options: {
          Green: '#00ff00',
          Red: '#ff0000',
        },
        onChange,
      };

      const wrapper = render(ThemedSelectType({ knob }));

      const green = wrapper.getByTitle('Green');

      expect(green).toHaveTextContent('Green');
      expect(green).toHaveProperty('value', 'Green');
    });
  });
});
