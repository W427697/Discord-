import React from 'react';
import { shallow, mount } from 'enzyme';
import SelectType from '../types/Select';

describe('Select', () => {
  let knob;
  let onChange;

  describe('Object values', () => {
    beforeEach(() => {
      onChange = jest.fn();
      knob = {
        name: 'Colors',
        value: '#00ff00',
        options: {
          Green: '#00ff00',
          Red: '#ff0000',
        },
        onChange,
      };
    });

    it('correctly maps option keys and values', () => {
      const wrapper = shallow(<SelectType knob={knob} />);

      const green = wrapper.find('option').first();
      expect(green.text()).toEqual('Green');
      expect(green.prop('value')).toEqual('Green');
    });
  });

  describe('calls onChange callback', () => {
    it('calls ', async () => {
      const wrapper = mount(<SelectType knob={knob} onChange={onChange} />);

      wrapper.find('select').simulate('change', { target: { value: '#ff0000' } });

      expect(onChange).toHaveBeenCalledWith('#ff0000');
    });
  });

  describe('Array values', () => {
    beforeEach(() => {
      knob = {
        name: 'Colors',
        value: 'green',
        options: ['green', 'red'],
      };
    });

    it('correctly maps option keys and values', () => {
      const wrapper = shallow(<SelectType knob={knob} />);

      const green = wrapper.find('option').first();
      expect(green.text()).toEqual('green');
      expect(green.prop('value')).toEqual('green');
    });
  });
});
