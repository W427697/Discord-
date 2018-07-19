import React from 'react';
import { mount } from 'enzyme';
import RadioType from '../types/Radio';

describe('Radio', () => {
  let knob;

  beforeEach(() => {
    knob = {
      name: 'Colors',
      value: '#00ff00',
      options: {
        Green: '#00ff00',
        Red: '#ff0000',
      },
    };
  });

  describe('displays value', () => {
    it('correctly maps option keys and values', () => {
      const wrapper = mount(<RadioType knob={knob} />);
      const inputGreen = wrapper.find('input').first();
      const labelGreen = wrapper.find('label').first();

      expect(inputGreen.props().value).toEqual('#00ff00');
      expect(labelGreen.props().children).toEqual('Green');
    });
  });
});
